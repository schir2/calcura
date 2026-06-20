import { defineRule } from 'vee-validate';
import {min_value, max_value, required, email} from '@vee-validate/rules';

export default defineNuxtPlugin(() => {
    defineRule('min_value', min_value);
    defineRule('max_value', max_value);
    defineRule('required', required);
    defineRule('email', email);
});
