const mongoose = require('mongoose');
const validator = require ('validator');
const bcrypt = require ('bcryptjs');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true} 
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login() {
    this.validation();
    if ( this.errors.length > 0 ) return;

    this.user = await LoginModel.findOne( { email: this.body.email } )

    if( !this.user ) {
      this.errors.push("O usuário não existe!");
      return;
    }

    if( !bcrypt.compareSync( this.body.password, this.user.password )) {
      this.errors.push("Senha inválida!");
      this.user = null;
      return;
    }
  }

  async register() {
    this.validation();
   
    if ( this.errors.length > 0 ) return;

    await this.userExists();

    if ( this.errors.length > 0 ) return;

    const salt = bcrypt.genSaltSync();
    this.body.password = bcrypt.hashSync(this.body.password, salt);

    this.user = await LoginModel.create(this.body);
   
  }

  validation() {
    this.cleanUp();

    //validacao
    if ( !validator.isEmail(this.body.email)) {
      this.errors.push('E-mail invalido');
    }

    if(this.body.password.length < 3 || this.body.password.length > 50) {  
      console.log(typeof this.body.password);
      this.errors.push("A senha precisa ter entre 3 a 50 caracteres. ")
    }

  }

  cleanUp() {
    for( const key in this.body) {
      if ( typeof this.body[key] !== 'string' ) {
        this.body[key] = '';
      }
    }
    this.body = {
      email: this.body.email,
      password: this.body.password
    }

  }

  async userExists() {
    this.user = await LoginModel.findOne( { email: this.body.email } )
    if( this.user ) this.errors.push(" O usuário já existe ");
  }

}

module.exports = Login;
