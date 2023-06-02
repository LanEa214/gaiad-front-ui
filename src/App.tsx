import { PageLoading } from '@ant-design/pro-components';
import Layout from '@components/Layout';
import useGlobalState from '@hook/globalState';
import { CustomHashRouter } from '@utils/customRouter';

const App = () => {
  const state = useGlobalState();
  return <CustomHashRouter>{state ? <Layout /> : <PageLoading />}</CustomHashRouter>;
};

export default App;
