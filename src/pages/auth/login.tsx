import { useForm } from '@refinedev/react-hook-form';
import * as React from 'react';
import { FormProvider } from 'react-hook-form';
import {
  type LoginPageProps,
  type LoginFormTypes,
  useActiveAuthProvider,
  type BaseRecord,
  type HttpError,
  useLogin,
  useTranslate,
  useLink,
} from '@refinedev/core';
import { ThemedTitle } from '@refinedev/mui';
import { layoutStyles, titleStyles } from './styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import MuiLink from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { BoxProps } from '@mui/material/Box';
import type { CardContentProps } from '@mui/material/CardContent';
import type { FormPropsType } from '../index';

type LoginProps = LoginPageProps<BoxProps, CardContentProps, FormPropsType>;

interface CustomLoginFormTypes extends Omit<LoginFormTypes, 'email'> {
  loginType?: 'username' | 'email';
}
/**
 * login will be used as the default type of the <AuthPage> component. The login page will be used to log in to the system.
 * @see {@link https://refine.dev/docs/api-reference/mui/components/mui-auth-page/#login} for more details.
 */

export const LoginPage: React.FC<LoginProps> = ({
  providers,
  registerLink,
  forgotPasswordLink,
  rememberMe,
  contentProps,
  wrapperProps,
  renderContent,
  formProps,
  title,
  hideForm,
  mutationVariables,
}) => {
  const { onSubmit, ...useFormProps } = formProps || {};
  const methods = useForm<BaseRecord, HttpError, CustomLoginFormTypes>({
    ...useFormProps,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { mutate: login, isPending } = useLogin<CustomLoginFormTypes>();
  const translate = useTranslate();
  const Link = useLink();

  const PageTitle =
    title === false ? null : (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '32px',
          fontSize: '20px',
        }}
      >
        {title ?? (
          <ThemedTitle
            collapsed={false}
            wrapperStyles={{
              gap: '8px',
            }}
          />
        )}
      </div>
    );

  const renderProviders = () => {
    if (providers && providers.length > 0) {
      return (
        <>
          <Stack spacing={1}>
            {providers.map((provider: any) => {
              return (
                <Button
                  key={provider.name}
                  variant="outlined"
                  fullWidth
                  sx={{
                    color: 'primary.light',
                    borderColor: 'primary.light',
                    textTransform: 'none',
                  }}
                  onClick={() =>
                    login({ ...mutationVariables, providerName: provider.name })
                  }
                  startIcon={provider.icon}
                >
                  {provider.label}
                </Button>
              );
            })}
          </Stack>
          {!hideForm && (
            <Divider
              sx={{
                fontSize: '12px',
                marginY: '16px',
              }}
            >
              {translate('pages.login.divider', 'or')}
            </Divider>
          )}
        </>
      );
    }
    return null;
  };

  const Content = (
    <Card {...(contentProps ?? {})}>
      <CardContent sx={{ p: '32px', '&:last-child': { pb: '32px' } }}>
        {
          <Typography
            component="h1"
            variant="h5"
            align="center"
            style={titleStyles}
            color="primary"
            fontWeight={700}
          >
            {translate('pages.login.title', 'Sign in')}
          </Typography>
        }
        {renderProviders()}
        {!hideForm && (
          <Box
            component="form"
            onSubmit={handleSubmit((data) => {
              if (onSubmit) {
                return onSubmit(data);
              }

              return login({ ...mutationVariables, ...data });
            })}
          >
            <TextField
              {...register('loginType', {
                required: translate(
                  'pages.login.errors.required',
                  'This field is required'
                ),
              })}
              id="loginType"
              margin="normal"
              fullWidth
              label={translate(
                'pages.login.fields.loginType',
                'Email or Username'
              )}
              error={!!errors.loginType}
              name="loginType"
              type="text"
              //autoComplete="email"
              sx={{
                mt: 0,
              }}
            />
            <TextField
              {...register('password', {
                required: translate(
                  'pages.login.errors.requiredPassword',
                  'Password is required'
                ),
              })}
              id="password"
              margin="normal"
              fullWidth
              name="password"
              label={translate('pages.login.fields.password', 'Password')}
              helperText={errors?.password?.message}
              error={!!errors.password}
              type="password"
              placeholder="●●●●●●●●"
              autoComplete="current-password"
              sx={{
                mb: 0,
              }}
            />
            <Box
              component="div"
              sx={{
                mt: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {rememberMe ?? (
                <FormControlLabel
                  sx={{
                    span: {
                      fontSize: '14px',
                      color: 'text.secondary',
                    },
                  }}
                  color="secondary"
                  control={
                    <Checkbox
                      size="small"
                      id="remember"
                      {...register('remember')}
                    />
                  }
                  label={translate(
                    'pages.login.buttons.rememberMe',
                    'Remember me'
                  )}
                />
              )}
              {forgotPasswordLink ?? (
                <MuiLink
                  variant="body2"
                  color="primary"
                  fontSize="12px"
                  component={Link as any}
                  underline="none"
                  to="/forgot-password"
                >
                  {translate(
                    'pages.login.buttons.forgotPassword',
                    'Forgot password?'
                  )}
                </MuiLink>
              )}
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isPending}
              sx={{ mt: '24px' }}
            >
              {translate('pages.login.signin', 'Sign in')}
            </Button>
          </Box>
        )}
        {registerLink ?? (
          <Box
            sx={{
              mt: '24px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography
              textAlign="center"
              variant="body2"
              component="span"
              fontSize="12px"
            >
              {translate(
                'pages.login.buttons.noAccount',
                'Don’t have an account?'
              )}
            </Typography>
            <MuiLink
              ml="4px"
              fontSize="12px"
              variant="body2"
              color="primary"
              component={Link as any}
              underline="none"
              to="/register"
              fontWeight="bold"
            >
              {translate('pages.login.signup', 'Sign up')}
            </MuiLink>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <FormProvider {...methods}>
      <Box component="div" style={layoutStyles} {...(wrapperProps ?? {})}>
        <Container
          component="main"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: hideForm ? 'flex-start' : 'center',
            alignItems: 'center',
            minHeight: '100dvh',
            padding: '16px',
            width: '100%',
            maxWidth: '400px',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: '400px',
              display: 'flex',
              flexDirection: 'column',
              paddingTop: hideForm ? '15dvh' : 0,
            }}
          >
            {renderContent ? (
              renderContent(Content, PageTitle)
            ) : (
              <>
                {PageTitle}
                {Content}
              </>
            )}
          </Box>
        </Container>
      </Box>
    </FormProvider>
  );
};
