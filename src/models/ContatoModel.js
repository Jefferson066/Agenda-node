const mongoose = require('mongoose');
const validator = require('validator');


const ContatoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  telephone: { type: String, required: false, default: '' },
  createdIn: { type: Date, default: Date.now },
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

class Contato {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.contato = null;
  }

  async register() {
    this.validation();
    if (this.errors.length > 0) return;
    this.contato = await ContatoModel.create(this.body);
    
  }

  validation() {
    this.cleanUp(); 
    
    if (this.body.email && !validator.isEmail(this.body.email)) {
      this.errors.push('E-mail invalido');
     
    }

    if(!this.body.name) {
      this.errors.push('Nome é um campo obrigatório');
     
    }

    if(!this.body.email && !this.body.telephone) {
      this.errors.push('Pelo menos um contato precisa ser enviado: e-mail ou telefone');
     
    }
  }

  cleanUp() {
    for( const key in this.body) {
      if ( typeof this.body[key] !== 'string' ) {
        this.body[key] = '';
      }
    }
    this.body = {
      name: this.body.name,
      lastName: this.body.lastName,
      email: this.body.email,
      telephone: this.body.telephone,
    }
    
  }

  static async  contatoFindId(id) {
    if( typeof id !== 'string') return;
    const result = await ContatoModel.findById(id);
    return result;
  }

  async edit(id) {
    if( typeof id !== 'string') return;
    this.validation();
    if (this.errors.length > 0) return;
    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });
   
  }

  static async  findContatos() {
    const result = await ContatoModel.find().sort({ createdIn: -1 });
    return result;
  }

  static async  delete(id) {
    if( typeof id !== 'string') return;
    const result = await ContatoModel.findOneAndDelete({_id: id});
    return result;
  }

}

module.exports = Contato;
