const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useCreateIndex: true })
const db = mongoose.connection

const capresSchema = new mongoose.Schema({
    name: { type: String, index: true }
})
capresSchema.methods.yell = function () {
    let greet = this.name ? `halo saya adalah ${this.name}` : ` i  am a man of no name`
    console.log(greet)
}
const Capres = mongoose.model('Capres', capresSchema)


db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
    console.log('we are connected')
})

let Jokowi = new Capres({ name: `Jokowi` });
// Jokowi.yell();

(async (name) => {

    // let o = 1;
    const thereIsOneBefore = await Capres.where({ name: name }).findOne()
    // let result = await Jokowi.save()
    if (thereIsOneBefore) console.log('not creating');
    else {
        let a = await Jokowi.save();
        console.log(a)
    }

})('Jokowi')
    .catch(err => console.log(`err`))
    .finally(_ => db.close(_ => console.log(`let's close the db`)));


// Jokowi.save((err,Jokowi)=>{
//     if(err) console.log(`data cannot be saved` ,err)
//     else console.log(Jokowi)
// })







// db.close(()=>console.log('closing'))