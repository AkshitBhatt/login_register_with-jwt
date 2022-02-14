require('dotenv').config
const express=require('express')
const app=express()
const port=process.env.port || 8000
const knex=require('./config/db')
const {authorization,authentication}=require('./auth/security')

app.use(express.json())


app.post('/register',(req,res)=>{
    knex('user_data').where({email:req.body.email}).then(data=>{
        if(data.length == 0){
            knex('user_data').insert(req.body).then(()=>{
                res.send('data inserted')
            }).catch(err=>{
                res.send(err.message)
            })
        }else{
            res.send('user already registered')
        }
    })
})

app.post('/login',(req,res)=>{
    if(req.headers.cookie){
        res.send("logout first")
    }else {
        knex('user_data').where({email:req.body.email,password:req.body.password}).then(data=>{
            if(data.length>0){
                const token=authorization(data[0])
                res.cookie('token',token).send('you are now logged')
            }else{
                res.send('incorrect email or password')
            }
        }).catch(err=>{
            res.send(err.message)
        })
    }
})
app.get('/getdata',authentication,(req, res) => {
    knex("user_data").then((data) => {
        console.log(req.userData)
        res.send(data)
    }).catch(err => {
        res.send(err.message)
    })
})


app.get("/profile",authentication, (req, res)=>{
    res.send(req.userData.name)
})


app.put("/deletedata/:email", authentication, (req, res) => {
    const email = req.params.email
    const newData = {
        email: email,
        name: req.body.name,
        password: req.body.password
    }

    knex('user_data').where({ email }).del(newData).then(() => {
        res.send('dataupdated')
    }).catch(err => {
        res.send(err.message)
    })

})

app.get("/logout", authentication,(req,res)=>{
    res.clearCookie("token").send('logged out')
})




app.listen(port,()=>{
    console.log('port is listening ',port);
})