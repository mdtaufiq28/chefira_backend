import express from 'express';
import cors from 'cors';
import { AccessToken } from 'livekit-server-sdk';
import {v4 as uuidv4} from 'uuid';


const app=express();
const PORT=process.env.PORT || 4000;

console.log("Welcome to Server of Chefira");

app.use(cors());
app.use(express.json());

app.get('/health',(req,res)=>{
    res.status(200).json({status:'ok'});
})

app.post("/token",async (req,res)=>{

    console.log(process.env.LIVEKIT_API_KEY);
    console.log(process.env.LIVEKIT_API_SECRET);

    const {identity,role}=req.body;
    
    if(!identity){
        return res.status(400).json({error:"identity is required"});
    }

    const token=new AccessToken(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_API_SECRET,
        {
        identity:identity
        }
    )

    if(role==='chef'){
        token.metadata=JSON.stringify({role:'chef'});
        const roomId=uuidv4();
        token.addGrant({
        roomJoin:true,
        room:roomId,
        canPublish:true,
        canSubscribe:true
        });
        const jwt=await token.toJwt();
        res.json({roomId:roomId,token:jwt});

    }
    else if(role==='user'){
        const {roomId,requesting_session}=req.body;
        token.metadata=JSON.stringify({
        role:'user',
        user_session_type:requesting_session
        });
        token.addGrant({
        roomJoin:true,
        room:roomId,
        canPublish:true,
        canSubscribe:true
        });
        const jwt=await token.toJwt();

        res.json({token:jwt});
    }

    console.log(token);


    console.log("jwt is " ,jwt);


});

app.listen(PORT,()=>{
    console.log('Server is running on port ',PORT);
});

