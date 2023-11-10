import { expect, describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import WordCardVue from '../src/components/WordCard.vue'
import { Lang } from '../src/components/Dicts/common'

const testProps = {
    word: {
        id: 1,
        name: '',
        extension: {
            meanings: [],
            ukphone: '',
            usphone: '',
            notation: ''
        }
    },
    lang: Lang.Japanese,
    userInput: ''
};
describe('Japanese spell check: なん', ()=>{
    it('it should be done', async ()=>{
        const wrapper = mount(WordCardVue, {
            props: {...testProps, word: {...testProps.word, name: 'nan'}, userInput: 'na'}
          });
        
        await wrapper.setProps({userInput: 'nan'});
        expect(wrapper.emitted('done')).toBeTruthy();
    })
    it('it should not be done', async ()=>{
        const wrapper = mount(WordCardVue, {
            props: {...testProps, word: {...testProps.word, name: 'nan'}, userInput: 'n'}
          });
        await wrapper.setProps({userInput: 'na'});
        expect(wrapper.emitted('done')).toBeFalsy();
    })
})

describe('Japanese spell check: なな', ()=>{
    it('it should be done', async ()=>{
        const wrapper = mount(WordCardVue, {
            props: {...testProps, word: {...testProps.word, name: 'nana'}, userInput: 'nan'}
          });
        await wrapper.setProps({userInput: 'nana'});
        expect(wrapper.emitted('done')).toBeTruthy();
    })
    it('it should not be done', async ()=>{
        const wrapper = mount(WordCardVue, {
            props: {...testProps, word: {...testProps.word, name: 'nana'}, userInput: 'na'}
          });
        await wrapper.setProps({userInput: 'nan'});
        expect(wrapper.emitted('done')).toBeFalsy();
    })
})