const express=require('express');
const res = require('express/lib/response');
const app=express();
const bodyParser = require('body-parser');
const fs=require('fs');
app.use("/assests",express.static('assests'));



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
    return res.redirect('/');
  });


//   Saving to local

const localStorage = require("localStorage");
app.post('/saveLocal/:id',(req,res)=>{
    console.log("saving to local");
    let obj={};
    console.log(obj);
    console.log(note[0]);
    obj=note[req.params.id-1];
    console.log("printing");
    console.log(obj);
    localStorage.setItem('UserName', JSON.stringify(obj));
    console.log(obj);
    console.log(localStorage.getItem('UserName'));

    return res.redirect('/');
})


// Editing

app.get('/edit/:id',(req,res)=>{
    res.render('edit',
    {id:req.params.id});
    console.log("get method");
    return 
})

app.post('/edit/:id',(req,res)=>{
    console.log("post");
    console.log(note);
    const id=req.params.id;
    console.log(id);

    console.log(req.body.updatednote);
    console.log(req.body.updatedtitle);
    const newobj={};

    newobj.id=req.params.id;
    newobj.body=req.body.updatednote;
    newobj.title=req.body.updatedtitle;

    console.log(req.params.id);
    console.log(newobj.body);
    console.log(newobj.title);

    note.splice(newobj.id-1,1,newobj);
    console.log(note);
   
    return res.redirect('/');
})

// Listening to port
const PORT=process.env.PORT||4000;
app.listen(PORT,()=>{
    console.log((`Listening at port ${PORT}`));
})
