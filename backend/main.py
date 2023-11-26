from fastapi import FastAPI, File, Request, status ,HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel

import jwt,requests,secrets
import secrets
from typing import Optional,List, Type
from datetime import datetime, timedelta

from fastapi.responses import StreamingResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
import openai
import requests
from decouple import config

openai.org=config("openai_org")
openai.api_key=config("openai_api_key")

jwt_secret_key = config("jwt_secret_key")

SECERT_KEY = jwt_secret_key
ALGORITHM ="HS256"
ACCESS_TOKEN_EXPIRES_MINUTES = 800

app= FastAPI()
origins = ["*"]
app.add_middleware( CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"], )
security = HTTPBearer()

# Configure the SQLite database connection
SQLALCHEMY_DATABASE_URL = "sqlite:///./data.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Create a SessionLocal class to handle database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for declarative models
Base = declarative_base()

#pydantic models
class LoginItem(BaseModel):
    username: str
    password: str

class Chat(BaseModel):
    sender_type: str
    message: str
    message_type: str

class Conversation(BaseModel):
    user_id: int
    chats: List[Chat] = []

class UserBase(BaseModel):
    username: str
    mobile: str
    email: str
    password:str

class User(UserBase):
    conversations: List[Conversation] = []

    class Config:
        orm_mode = True


# User model
class DBUser(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String, index=True, unique=True)
    mobile = Column(String, index=True)
    email = Column(String, index=True)
    password = Column(String, index=True)
    
    # Define the one-to-many relationship with Conversation objects
    conversations = relationship("DBConversation", back_populates="user")

# Conversation model
class DBConversation(Base):
    __tablename__ = "conversations"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"))  # Foreign key to associate with user
    date = Column(DateTime, default=datetime.utcnow)

    # Define the one-to-many relationship with Chat objects
    chats = relationship("DBChat", back_populates="conversation")

# Chat model
class DBChat(Base):
    __tablename__ = "chats"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    sender_type = Column(String)
    message = Column(String)
    message_type = Column(String)
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
# Update the relationship in Chat model to use Conversation
DBChat.conversation = relationship("DBConversation", back_populates="chats")

# Update the relationship in Conversation model to use User
DBConversation.user = relationship("DBUser", back_populates="conversations")

# Create the database tables
Base.metadata.create_all(bind=engine)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECERT_KEY, algorithms=ALGORITHM)
        return payload['username']

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except (jwt.InvalidTokenError, KeyError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

from datetime import datetime, timedelta

def categorize_chats_by_datetime(db, username):
    user = db.query(DBUser).filter(DBUser.username == username).first()

    if user is None:
        return {"error": "User not found"}

    current_time = datetime.utcnow()

    chats_dict = {
        "days": []
    }

    user_conversations = user.conversations
    for conversation in user_conversations:
        conversation_chats = []

        for chat in conversation.chats:
            conversation_chats.append(chat)

        if conversation_chats:
            conversation_chats.sort(key=lambda x: x.conversation.date)  # Sort chats by date

            last_user_chat = None
            day = None

            for chat in reversed(conversation_chats):
                chat_date = chat.conversation.date.date()
                if day is None:
                    day = chat_date

                if chat_date == day and chat.sender_type == "user":
                    last_user_chat = chat
                    break  # Stop iterating once the last user chat of the day is found

            if last_user_chat:  # Add the last user chat of the conversation
                day_str = (current_time.date() - last_user_chat.conversation.date.date()).days
                if day_str == 0:
                    day_str = "today"
                elif day_str == 1:
                    day_str = "yesterday"
                else:
                    day_str = f"{day_str} days ago"

                chats_dict["days"].append({
                    "day": day_str,
                    "chats": [
                        {
                            "conversation_id": conversation.id,
                            "message": last_user_chat.message
                        }
                    ]
                })

    return chats_dict


def add_chats(db: Session, username: str, chats: List[Chat]):
    user = db.query(DBUser).filter(DBUser.username == username).first()
    
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    new_conversation = DBConversation(user_id=user.id)
    db.add(new_conversation)
    db.commit()
    db.refresh(new_conversation)
    
    for chat_data in chats:
        new_chat = DBChat(sender_type=chat_data.sender_type, message=chat_data.message, message_type=chat_data.message_type,
                          conversation_id=new_conversation.id)
        db.add(new_chat)
    
    db.commit()
    
    return new_conversation.id

# API to add chats to a conversation
@app.post("/add_chats")
def add_chats_to_conversation( chats: List[Chat],username: str = Depends(get_current_user), db: Session = Depends(get_db)):
    conversation_id = add_chats(db, username, chats)
    return {"conversation_id": conversation_id}


# API to delete a conversation
@app.delete("/conversations/{conversation_id}")
def delete_conversation(conversation_id: int, db: Session = Depends(get_db),username: str = Depends(get_current_user)):
    conversation = db.query(DBConversation).filter(DBConversation.id == conversation_id).first()
    
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    db.delete(conversation)
    db.commit()
    
    return {"message": "Conversation deleted successfully"}


# Function to update chats in a conversation
def update_chats(db: Session, conversation_id: int, new_chats: List[Chat]):
    conversation = db.query(DBConversation).filter(DBConversation.id == conversation_id).first()
    
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Delete old chats
    for chat in conversation.chats:
        db.delete(chat)
    
    # Add new chats
    for chat_data in new_chats:
        new_chat = DBChat(sender_type=chat_data.sender_type, message=chat_data.message, message_type=chat_data.message_type,
                          conversation_id=conversation.id)
        db.add(new_chat)
    
    db.commit()

@app.put("/update_chats/{conversation_id}")
def update_chats_in_conversation(conversation_id: int, new_chats: List[Chat], db: Session = Depends(get_db),username: str = Depends(get_current_user)):
    update_chats(db, conversation_id, new_chats)
    return {"message": "Chats updated successfully"}

# API to fetch a conversation and related chats
@app.get("/conversations/{conversation_id}")
def get_conversation_with_chats(conversation_id: int, username: str = Depends(get_current_user), db: Session = Depends(get_db)):
    conversation = db.query(DBConversation).filter(DBConversation.id == conversation_id).first()
    
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    conversation_data = {
        "id": conversation.id,
        "user_id": conversation.user_id,
        "chats": []
    }
    
    for chat in conversation.chats:
        chat_data = {
            "sender_type": chat.sender_type,
            "message": chat.message,
            "message_type": chat.message_type,
        }
        conversation_data["chats"].append(chat_data)
    
    return conversation_data

@app.post("/signup")
def create_user(user: UserBase, db: Session = Depends(get_db)):
    # Check if the user with the given username already exists
    # return ("message":"Hello world")
    existing_user = db.query(DBUser).filter_by(username=user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    # Create a new user
    db_user = DBUser(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user



@app.post("/login")
async def user_login(loginitem:LoginItem, db: Session = Depends(get_db)):
    data = jsonable_encoder(loginitem)

    # Check if the user with the given username already exists
    existing_user = db.query(DBUser).filter_by(username=data['username']).first()
    if existing_user:
        if existing_user.password == data['password']:
            encoded_jwt = jwt.encode(data, SECERT_KEY, algorithm=ALGORITHM)
            return {"token": encoded_jwt} 
        else:
            return {"message":"wrong password"}
    else:
        return {"message":"User Does not exist!"}
        raise HTTPException(status_code=400, detail="Username already exists")






#  API FOR CONVERTING TEXT TO AUDIO
@app.post("/convert-text-to-audio")
async def converttexttoaudio(response: Request):
        body = await response.json()
        text = body['text']
        endpoint="https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM"
        body={
        "text": text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            "stability": 0,
            "similarity_boost": 0,
            "style": 0.5,
            "use_speaker_boost": True
        }
        }
        headers={"xi-api-key":config("eleven_lab"),
        'accept': 'audio/mpeg',
        'Content-Type': "application/json"}
        response=requests.post(endpoint,json=body,headers=headers)
        audio_output=response.content
        def iterfile():
            yield audio_output
        # print(iterfile())
        return StreamingResponse(iterfile(), media_type="application/octet-stream")



@app.post("/post-audio/")
async def post_audio(file = File()):
    buffer=open(file.filename, "wb")
    buffer.write(file.file.read())
    buffer.close()
    fileOpener=open(file.filename,"rb")
    # AudioToText=openai.Audio.transcribe("whisper-1",fileOpener)
    # message=AudioToText["text"]
    # responseFromChatGPT=openai.ChatCompletion.create(

    # model="gpt-3.5-turbo",

    # messages=[
    #         {"role": "user", "content":message },
    #     ]
    # )
    # chatgptanswer=responseFromChatGPT["choices"][0]['message']["content"]
    chatgptanswer="OpenAI currently unavailable, response cannot be generated"

    endpoint="https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM"
    body={
    "text": chatgptanswer,
    "model_id": "eleven_monolingual_v1",
    "voice_settings": {
        "stability": 0,
        "similarity_boost": 0,
        "style": 0.5,
        "use_speaker_boost": True
    }
    }

    headers={"xi-api-key":"f027a5be4d69f1bf6962595c91c5a3eb",
        'accept': 'audio/mpeg',
        'Content-Type': "application/json"}

    response=requests.post(endpoint,json=body,headers=headers)
    audio_output=response.content

    def iterfile():
        yield audio_output

    # Use for Post: Return output audio
    return StreamingResponse(iterfile(), media_type="application/octet-stream")

# AUDIO TO TEXT

@app.post("/convert-audio-to-text")
async def audtotext(file = File()):
    buffer=open(file.filename, "wb")
    buffer.write(file.file.read())
    buffer.close()
    fileOpener=open(file.filename,"rb")  

    AudioToText=openai.Audio.transcribe("whisper-1",fileOpener)
    # message=AudioToText["text"]
    message="Audo could not be converted due to openAI unavailibilty"
    # responseFromChatGPT=openai.ChatCompletion.create(
    # model="gpt-3.5-turbo",
    # messages=[
    #         {"role": "user", "content":message },
    #     ]
    # )
    # chatgptanswer=responseFromChatGPT["choices"][0]['message']["content"]
    # chatgptanswer="I love you so much Converted"
    return message;  

@app.get("/{name}")
def greet_user(name: str):
    # response = openai.ChatCompletion.create(
    #     model="gpt-3.5-turbo",
    #     messages=[
    #         {"role":"user", "content":name}
    #     ]
    # )
    # print(response)
    return{
        #"response":response.choices[0].message.content,
        "response":"OpenAI is currently unavailable due to unavailibility of keys"
    }


@app.get("/sidebar/")
def get_sidebar_data(username: str = Depends(get_current_user), db: Session = Depends(get_db)):
    return categorize_chats_by_datetime(db,username)