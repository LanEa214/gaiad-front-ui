/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    // 这里可以加样式替换tailwind原有的样式，例如：
    // padding: {
    //   '1': '30px'
    // }
    // 这个值替换了原有的p-1这个类名的属性
    extend: {},
  },
  plugins: [],
};
