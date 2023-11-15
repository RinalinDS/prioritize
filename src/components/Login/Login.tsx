import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { FormikHelpers, useFormik } from 'formik';
import { FC, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { storeHooks } from '../../hooks';
import { authActions } from '../../store/reducers/AuthReducer';
import { authSelectors } from '../../store/selectors/';
import { FormValuesType, LoginParamsType } from '../../types';
import { selectTheme } from '../../store/selectors/appSelectors';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



export const Login: FC = () => {
  const {useAppDispatch, useAppSelector} = storeHooks
  const isLoggedIn = useAppSelector<boolean>(authSelectors.selectIsLoggedIn)
  const dispatch = useAppDispatch()
  const theme = useAppSelector<string>(selectTheme)
  const isDarkTheme = theme === "dark";

  const [expanded, setExpanded] = useState<boolean>(false);

  const handleChange = () => {
      setExpanded(!expanded);
    };



  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validate: values => {
      const errors: Partial<Omit<LoginParamsType, "captcha">> = {};
      if (!values.password) {
        errors.password = 'Required';
      } else if (values.password.length < 3) {
        errors.password = 'Must be 3 characters or more';
      }
      if (!values.email) {
        errors.email = 'Required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
      }
      return errors;
    },
    onSubmit: async (values, formikHelpers: FormikHelpers<FormValuesType>) => {
      //@ts-expect-error thunk
      const action = await dispatch(authActions.login(values)) // придет либо loginTC.fulfilled, или rejected
      if (authActions.login.rejected.match(action)) { //Из документации. Если тип action = rejected, то значит в пейлоаде
        // будет fields error, и значит можно его записывать в локальный state formik с помощью formikHelper
        if (action.payload?.fieldsError) {
          const error = action.payload.fieldsError[0]
          formikHelpers.setFieldError(error.field, error.error)
        }
      }
    },
  })
  if (isLoggedIn) return <Navigate to={'/'}/>

  return <Grid container justifyContent={'center'}>
    <Grid item justifyContent={'center'}>
      <FormControl>
        <FormLabel style={{color: isDarkTheme?  '#f1f1f1' : '#121620'}}>
       
          <p style={{textAlign: 'center'}}>To log in get registered
            <a href={'https://social-network.samuraijs.com/'}
               target={'_blank'} rel="noreferrer"> here
            </a>
          </p>
          <Accordion onChange={handleChange} expanded={expanded}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>common test account credentials</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          Email: free@samuraijs.com
          </Typography>
          <Typography>

          Password: free
          </Typography>

        </AccordionDetails>
      </Accordion>
        </FormLabel>

        <form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <TextField label="Email" margin="normal" {...formik.getFieldProps('email')}  InputLabelProps={{
              style: isDarkTheme? { backgroundColor: '#fff' } :{}
            }}/>
            {formik.touched.email && formik.errors.email &&
              <div style={{color: 'red'}}>{formik.errors.email}</div>}
            <TextField type="password" label="Password"
                       margin="normal"  {...formik.getFieldProps('password')}
                       InputLabelProps={{
                         style: isDarkTheme? { backgroundColor: '#fff' } :{}
                       }}/>
            {formik.touched.password && formik.errors.password &&
              <div style={{color: 'red'}}>{formik.errors.password}</div>}
            <FormControlLabel label={'Remember me'}
                              control={<Checkbox {...formik.getFieldProps('rememberMe')}/>}/>
            <Button type={'submit'} variant={'contained'} color={'primary'}>
              Login
            </Button>
          </FormGroup>
        </form>

      </FormControl>
    </Grid>
  </Grid>
}
