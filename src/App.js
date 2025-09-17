import './App.css';
import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from '~/routes';

function App() {
  return (
    <Router>
            <div className="App">
                 <Routes>
                    {publicRoutes.map((route, index) => {
                        let Layout = Fragment;
                        if (route.layout) {
                            Layout = route.layout;
                        }

                        const DefaultComponent = route.children?.[0]?.component;

                        const Page = route.component;
                        return (
                            <Route
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                                key={index}
                            >
                                {DefaultComponent && <Route index element={<DefaultComponent />} />}

                                {route.children?.map((child, i) => {
                                    const ChildPage = child.component;
                                    return <Route path={child.path} element={<ChildPage />} key={i} />;
                                })}
                            </Route>
                        );
                    })}
                </Routes>
            </div>
        </Router>
  );
}

export default App;
