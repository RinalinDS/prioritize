import { FC, useEffect, useState } from 'react';

import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { ErrorSnackbar } from "./components/common/SnackbarError/SnackbarError";
import { Login } from './components/Login/Login';
import { TodolistsList } from "./components/TodolistList/TodolistsList";
import { storeHooks } from './hooks';
import { appSelectors, authSelectors } from './store/selectors';

import { AppBar, Button, Container, LinearProgress, Toolbar } from '@mui/material';
import styled, { ThemeProvider } from 'styled-components';
import { InitializePreloader } from './components/common/Prealoder/InitializePreloader';
import { Path } from './enums';
import { darkTheme, GlobalStyles, lightTheme } from './Global';
import { appActions } from './store/reducers/AppReducer';
import { authActions } from './store/reducers/AuthReducer';
import { Toggler } from './Toggler';

const AppWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
`


export const App: FC = () => {
  const {useActions, useAppSelector} = storeHooks
  const navigate = useNavigate();

  const status = useAppSelector(appSelectors.selectStatus)
  const isInitialized = useAppSelector(appSelectors.selectIsInitialized)
  const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn)


  const {initializeApp, setAppTheme} = useActions(appActions)
  const {logout} = useActions(authActions)

  useEffect(() => {
    initializeApp()
    // это все та же строка dispatch(initilizeAppTC()),но теперь , благодаря хуку useActions, вызов происходит скрыто от нас, но это просто фикция)
  }, [])

  const [theme, setTheme] = useState("dark");
  const isDarkTheme = theme === "dark";

  const toggleTheme = () => {
    const updatedTheme = isDarkTheme ? "light" : "dark";
    setTheme(updatedTheme);
    localStorage.setItem("theme", updatedTheme);
    setAppTheme(updatedTheme)
  };
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme && ["dark", "light"].includes(savedTheme)) {
      setTheme(savedTheme);
      setAppTheme(savedTheme)
    } else if (prefersDark) {
      setTheme("dark");
      setAppTheme('dark')
    }
  }, []);

  const logoutHandler = () => {
    logout()
    // это все та же строка dispatch(logoutTC()),но теперь , благодаря хуку useActions, вызов происходит скрыто от нас, но это просто фикция)
  }
  const backHomeHandler = () => {
    navigate('/')
  }

  if (!isInitialized) {
    return <InitializePreloader/>
  }

  return (
    <div>
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <GlobalStyles/>
        <AppWrapper>
          <AppBar position="static" style={{background: '#2E3B55'}}>
            <Toolbar style={{display: 'flex', justifyContent: 'space-between'}}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Button color="inherit" onClick={backHomeHandler}>Home</Button>
                <Toggler value={isDarkTheme}
                         onChange={toggleTheme}> Dark </Toggler>
              </div>
              {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Log out</Button>}
            </Toolbar>
          </AppBar>
          {status === 'loading' && <LinearProgress color={'secondary'}/>}
          <Container fixed style={{marginBottom: '50px'}}>
            <Routes>
              <Route path={Path.Home} element={<TodolistsList/>}/>
              <Route path={Path.Login} element={<Login/>}/>
              <Route path={Path.ErrorPage} element={<h1>Someone FUCKED UP</h1>}/>
              <Route path={Path.AnyOther} element={<Navigate to={Path.ErrorPage}/>}/>
            </Routes>
          </Container>
          <ErrorSnackbar/>
        </AppWrapper>
      </ThemeProvider>
    </div>


  );
}


