import { Result } from 'antd';
import React from 'react';

export default class ChunksErrorBoundary extends React.Component {
  state = {
    hasError: false,
    message: '',
  };

  /*
      控制台报错 - Error: 警告
      页面崩溃白屏

      自身的错误自己不能处理，会冒泡找有没有其它的错误边界，没有被捕获就崩溃
    * */
  // componentWillReceiveProps(nextProps, nextContext) {
  //   if (JSON.stringify(nextProps.data) === '{}') {
  //     throw new Error('警告');
  //   }
  // }

  // 返回一个对象，更新state，用于渲染备用UI
  static getDerivedStateFromError(error: any) {
    return { hasError: true, message: error?.message };
  }

  // 获取错误日志
  componentDidCatch(error: any, errorInfo: any) {
    // 和上面的return功能一样，两个选其一
    // this.setState({
    //   hasError: true
    // });

    this.logErrorToMyService(error, errorInfo);
  }

  // 自定义上传的方法
  logErrorToMyService = (error: any, errorInfo: any) => {
    console.log('----error----', error);
    console.log('----errorInfo----', errorInfo);
    // vite版本获取不到最新的modules
    if (error?.message?.startsWith('Failed to fetch dynamically')) {
      window.location?.reload();
    }
  };

  render() {
    const { hasError, message } = this.state;
    // eslint-disable-next-line react/prop-types
    const { children } = this.props as any;

    if (hasError) {
      return <Result status="error" title="Something went wrong" subTitle={message} />;
    } else {
      return children;
    }
  }
}
