import { Button, Result } from 'antd';
import { history } from '@utils/umi';
import type { RouteContextType } from '@ant-design/pro-components';
import { RouteContext } from '@ant-design/pro-components';

type IExceptionContainer = {
  element: React.ReactNode;
};

const ExceptionContainer = ({ element }: IExceptionContainer) => {
  return (
    <RouteContext.Consumer>
      {({ currentMenu }: RouteContextType) => {
        if (currentMenu?.unaccessible) {
          return (
            <Result
              status={'403'}
              title={'403'}
              subTitle={'抱歉，你无权访问该页面'}
              extra={
                <Button type="primary" onClick={() => history.push('/')}>
                  返回首页
                </Button>
              }
            />
          );
        }
        return element;
      }}
    </RouteContext.Consumer>
  );
};

export default ExceptionContainer;
