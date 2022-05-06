const express=require('express');
const res = require('express/lib/response');
const app=express();
const bodyParser = require('body-parser');
const fs=require('fs');
app.use("/assests",express.static('assests'));

// getData();

const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/notes',{useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>console.log("connection done"))
.catch((err)=>console.log(err));


// Making Schema
const noteSchema= new mongoose.Schema({
    id:Number,
    title:String,
    body:String
})

// Making model
const Noteapp=new mongoose.model("Notesapp",noteSchema)

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
    }));

app.use(express.static('public'));


let note = [];

// Front page

app.get('/',(req,res)=>{
    // res.render('index')
    res.render('index', {
        note: note,
      });

})

// Adding Notes

app.post('/addnotes',(req,res)=>{
    const newN={};
    newN.id=note.length+1;
    newN.body=req.body.newNote;
    newN.title=req.body.NewTitle;
    note.push(newN);

    res.redirect('/');
})

// Deleting

app.post('/deleteNote/:id', function (req, res) {
    console.log("Delete part");
    console.log(req.params.id);
    const deleteNotes = note.filter(item => item.id != req.params.id);
    note = deleteNotes;
     
    // Deleting from Database

    Noteapp.deleteOne({id:req.params.id}).then(function(){
        console.log('deleted');
    })

    return res.redirect('/');
  });




//   Saving to local

// const localStorage = require("localStorage");
// app.post('/saveLocal/:id',(req,res)=>{
//     console.log("saving to local");
//     let obj={};
//     console.log(obj);
//     console.log(note[0]);
//     obj=note[req.params.id-1];
//     console.log("printing");
//     console.log(obj);
//     localStorage.setItem('UserName', JSON.stringify(obj));
//     console.log(obj);
//     console.log(localStorage.getItem('UserName'));

//     return res.redirect('/');
// })

// Saving to database
app.post('/savelocal/:id',(req,res)=>{
    // res.send("hello");
     let uid=req.params.id;

    const saveDb=new Noteapp({
        id:uid,
        title:note[uid-1].title,
        body:note[uid-1].body
    })

    saveDb.save()
    return res.redirect('/');
})

const getDocument=async()=>{
    const result=await Noteapp.find();
    note=result;
    console.log(`Saved in db =  ${result}`);
}

getDocument();

// Editing

app.get('/edit/:id',(req,res)=>{
    res.render('edit',
    {id:req.params.id});
    console.log("get method");
    return 
})

app.post('/edit/:id',(req,res)=>{
    const id=req.params.id;
    const newobj={};

    newobj.id=req.params.id;
    newobj.body=req.body.updatednote;
    newobj.title=req.body.updatedtitle;


    note.splice(newobj.id-1,1,newobj);
    console.log(note);
   

    // Editing in database
    // nid=req.params.id;
 
    // Noteapp is model in database
    // Noteapp.findOneAndUpdate({id:1},{
    //     title:req.body.updatedtitle,
    //     body:req.body.updatednote
        
    // })
    // Noteapp.findOneAndUpdate
    Noteapp.findOneAndUpdate({id:req.params.id},{

        $set :{
     
           'title':req.body.updatedtitle,
     
           'body':req.body.updatednote
     
        }
     
      })


    return res.redirect('/');
})

// Listening to port
const PORT=process.env.PORT||4000;
app.listen(PORT,()=>{
    console.log((`Listening at port ${PORT}`));
})
