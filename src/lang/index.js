import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookie from 'js-cookie'
import elementEN from 'element-ui/lib/locale/lang/en'
import elementZH from 'element-ui/lib/locale/lang/zh-CN'
import customZH from './zh'
import customEN from './en'
Vue.use(VueI18n) // 全局注册国际化包
export default new VueI18n({
  locale: Cookie.get('language') || 'zh', // 从cookie中获取到语言类型
  messages: {
    en: {
      ...elementEN,
      ...customEN
    },
    zh: {
      ...elementZH,
      ...customZH
    }
  }

})
