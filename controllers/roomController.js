import db from '../models/index.js';


// 🔹 GET all rooms
export const getRooms = async (req,res)=>{
  try{

    const rooms = await db.Room.findAll({
      include:[
        db.RoomType
      ]
    });

    res.json(rooms);

  }catch(e){
    res.status(500).json({error:e.message});
  }
};


// 🔹 GET room by id
export const getRoom = async (req,res)=>{
  try{

    const room = await db.Room.findByPk(req.params.id,{
      include:[
        db.RoomType
      ]
    });

    if(!room)
      return res.status(404).json({message:'Room not found'});

    res.json(room);

  }catch(e){
    res.status(500).json({error:e.message});
  }
};


// 🔹 CREATE room (Admin)
export const createRoom = async (req,res)=>{
  try{

    const room = await db.Room.create(req.body);

    res.status(201).json(room);

  }catch(e){
    res.status(500).json({error:e.message});
  }
};


// 🔹 UPDATE room (Admin)
export const updateRoom = async (req,res)=>{
  try{

    const room = await db.Room.findByPk(req.params.id);

    if(!room)
      return res.status(404).json({message:'Room not found'});

    await room.update(req.body);

    res.json(room);

  }catch(e){
    res.status(500).json({error:e.message});
  }
};


// 🔹 DELETE room (Admin)
export const deleteRoom = async (req,res)=>{
  try{

    const room = await db.Room.findByPk(req.params.id);

    if(!room)
      return res.status(404).json({message:'Room not found'});

    await room.destroy();

    res.json({message:'Room deleted'});

  }catch(e){
    res.status(500).json({error:e.message});
  }
};
