import { PageLoading } from '@ant-design/pro-components';
import Layout from '@components/Layout';
import useGlobalState from '@hook/globalState';
import { CustomHashRouter } from '@utils/customRouter';
import './App.less';

const App = () => {
  const { initialState } = useGlobalState();
  return <CustomHashRouter>{initialState ? <Layout /> : <PageLoading />}</CustomHashRouter>;
};

export default App;
