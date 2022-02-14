require("dotenv").config()
const knex=require('knex')({
    client:"mysql",
    connection:{
       user:process.env.user,
       password:process.env.password,
       database:process.env.db,
       host:process.env.host 
    }
})


knex.schema.createTable('user_data', t=>{
    t.increments('id')
    t.string('name')
    t.string('email')
    t.string('password')
}).then(()=>{
    console.log('table created');
}).catch(err=>{
    console.log(err.message);
})


module.exports=knex