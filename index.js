import express from 'express';
import cors from 'cors';
import { AccessToken } from 'livekit-server-sdk';


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
        {identity}
    )

    if(role==='chef'){
        token.metadata=JSON.stringify({role:'chef'});
    }
    else if(role==='user'){
        token.metadata=JSON.stringify({role:'user'});
    }

    token.addGrant({
        roomJoin:true,
        room:"chef-room",
        canPublish:true,
        canSubscribe:true
    });

    console.log(token);

    const jwt=await token.toJwt();

    console.log("jwt is " ,jwt);

    res.json({token:jwt});

});

app.listen(PORT,()=>{
    console.log('Server is running on port ',PORT);
});

