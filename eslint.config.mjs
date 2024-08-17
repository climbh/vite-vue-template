import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'style/comma-dangle': ['error', 'never'], // 是否允许对象中出现结尾逗号
    'no-console': 'off'
  }
})
