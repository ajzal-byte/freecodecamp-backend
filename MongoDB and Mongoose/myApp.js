require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
    name:{
      type: String
    },
    age:{
      type: Number
    },
    favoriteFoods:{
      type: [String]
    }
  });

let Person = mongoose.model('Person', personSchema);


const createAndSavePerson = (done) => {
  const person = new Person({
    name: "Ajzal",
    age: 19,
    favoriteFoods: ['cookie']
  });
  person.save((err, data)=>{
    if(err){
      done(err);
      return;
    }
    console.log(data);
    done(null, data);
  })
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople , (err, data)=>{
    if(err){
      done(err);
      return;
    }
    console.log(data)
    done(null, data);
  })
};

const findPeopleByName = (personName, done) => {
  Person.find({name: personName}, (err, data)=>{
    if(err){
      done(err);
      return;
    }
    console.log(data);
    done(null, data);
  })
};

const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods: food}, 
  (err, data)=>{
    if(err){
      done(err);
      return;
    }
    console.log(data);
    done(null, data);
  })
};

const findPersonById = (personId, done) => {
  Person.findById(personId, (err, data)=>{
    if(err){
      done(err);
      return;
    }
    console.log(data);
    done(null, data);
  })
};

const findEditThenSave = (personName, done) => {
  const foodToAdd = "hamburger";
  Person.findById(personName, (err, person)=>{
    if(err){
      done(err);
      return;
    }
    console.log(person);
    person.favoriteFoods.push(foodToAdd);
    person.save((err, updatedPerson)=>{
      if(err){
        done(err);
        return;
      }
      console.log(updatedPerson);
      done(null, updatedPerson);
    })
  })
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate({name: personName}, {age: ageToSet}, {new: true})
.then(data=>{
  console.log(data);
   done(null, data);
});
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, data)=>{
    if(err){
      done(err);
      return;
    }
    console.log(data);
    done(null, data);
  })
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({name: nameToRemove}, (err,data)=>{
    if(err){
      done(err);
      return;
    }
    console.log(data);
    done(null, data);
  })
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person
    .find({favoriteFoods: foodToSearch})
    .sort({name: 1})
    .limit(2)
    .select(['name', 'favoriteFoods'])
    .exec((err, data)=>{
    if(err){
      done(err);
      return;
    }
    console.log(data);
    done(null, data);
  })
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
