from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import pickle

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

itemlist = None
with open ('./sets_elems_pickle', 'rb') as fp:
    itemlist = pickle.load(fp) 

@app.get("/")
async def root(): 
    return "CS765 Project"

@app.post("/set")
async def getSet(inputt:dict) -> dict:
    setName = inputt["setName"]
    for i in range(len(itemlist)):
        if itemlist[i]["name"] == setName:
            return {"name":setName, "elems":itemlist[i]["elems"]}
    return {}