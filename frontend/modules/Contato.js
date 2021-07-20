import validator from 'validator';
export default class Contato {
    constructor(formClass){
        this.form = document.querySelector(formClass);
    }

    init() {
        this.events();
    }

    events() {
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            this.validate(e);
        });
    }

    validate(e) {
        const el = e.target;
        const nameInput = el.querySelector('input[name="name"]');
        const emailInput = el.querySelector('input[name="email"]');
        const telephoneInput = el.querySelector('input[name="telephone"]');
        let error = false;

        if(!nameInput.value) {
            error = true;
            alert('Nome é um campo obrigatório');
            return;
        }

        if(!validator.isEmail(emailInput.value)) {
            alert("E-mail invalido");
            error = true;
            return;
        }

        if(!emailInput.value && !telephoneInput.value) {
            alert('Pelo menos um contato precisa ser enviado: e-mail ou telefone');
            error = true;
            return;
        }

        if(!error){
            el.submit();
        }

    }
}