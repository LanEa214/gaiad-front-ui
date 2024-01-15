import { PageContainer, ProCard, ProBreadcrumb } from '@ant-design/pro-components';
import { Button, Row, Space } from 'antd';
import { history } from '@utils/umi';
import { Outlet, Route, Routes, Navigate } from 'react-router-dom';
import { Link, useLocation } from '@utils/umi';

const App1 = () => {
  return (
    <>
      <ProCard className="text-3xl font-bold underline" title="标题1" headerBordered>
        welcome1
        <div onClick={() => console.log(null, 1, 2, 3)}></div>
      </ProCard>
      <ProCard title="标题2" headerBordered>
        welcome2
      </ProCard>
      <Row>
        <div>child is here</div>
        <Outlet />
      </Row>
    </>
  );
};

function Welcome() {
  const location = useLocation();
  console.log('location...', location);
  return (
    <PageContainer>
      <Button
        onClick={() => {
          history.push('/list/sub-page2/sub-demo');
        }}
      >
        跳转
      </Button>
      <ProBreadcrumb className="pb16 pt16" />

      <Space>
        <Link to={'apple'}>apple</Link>
        <Link to={'orange'}>orange</Link>
        <Link to={'bannan'}>bannan</Link>
      </Space>
      <Routes>
        <Route path="/" element={<Navigate to="apple" />} />
        <Route path="/" element={<App1 />}>
          <Route path="apple" element={<h1>apple</h1>} />
          <Route path="orange" element={<h1>orange</h1>} />
          <Route path="bannan" element={<h1>bannan</h1>} />
        </Route>
      </Routes>
    </PageContainer>
  );
}

export default Welcome;
