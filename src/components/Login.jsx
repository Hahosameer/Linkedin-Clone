import React from "react";
import styled from "styled-components";
import { connect, useDispatch, useSelector } from "react-redux";
import { signInAPI } from '../firebase/functions'
import {loginRequest, loginSuccess} from '../Redux/Slices/userSlice'
import { Navigate } from "react-router-dom";
function Login(props) {
  const selector = useSelector((state) => state.user);
  console.log(selector);
  const dispatch = useDispatch();
  return (
    <Container>
            {selector.user && <Navigate to="/" />}
      <Nav>
        <a href="/">
          <Logo src="/images/logo.png" alt="" />
        </a>
        <div>
        
          <Signin>Sign in</Signin>
        </div>
      </Nav>
      <Section>
        <Hero>
          <h1>Welcome to your professional comunity</h1>
          <img src="/images/login-hero.svg" alt="" />
        </Hero>
        <Form>
        <Google
            onClick={async () => {
              dispatch(loginRequest());
              console.log("Request sent");

              try {
                const result = await signInAPI(); 
                if (result instanceof Error) {
                  console.log(result.message); 
                } else {
                  dispatch(loginSuccess(result)); // Pass the user data to loginSuccess
                  console.log(result);
                }
              } catch (error) {
                console.error("Error during sign-in:", error); // Handle unexpected errors
              }
            }}
          >
            <img src="/images/google-icon.png" alt="" />
            <h2> Sign in with Google </h2>
          </Google>
        </Form>
      </Section>
    </Container>
  );
}

const Container = styled.div`
  padding: 0;
`;

const Nav = styled.nav`
  max-width: 1128px;
  margin: auto;
  padding:  10px 12px;
  display: flex;
  align-items: center;
  position: relative;
  justify-content: space-between;
  flex-wrap: nowrap;

  /* background-color: red; */
  & > a {
    @media (max-width: 768px) {
      padding:0 5px;
    }
  }
`;

const Logo = styled.img`
  width: 135px;
  height: 34px;
  @media (max-width: 768px) {
    width: 115px;
    height: 34px;
    }
`;

const Join = styled.a`
  font-size: 16px;
  padding: 10px 12px;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.6);
  margin-right: 12px;
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
    color: rgba(0, 0, 0, 0.9);
    text-decoration: none;
  }
  @media (max-width: 768px) {
    padding: 5px 9px;
    }
`;
const Signin = styled.a`
  box-shadow: inset 0 0 0 1px #0a66c2;
  color: #0a66c2;
  border-radius: 24px;
  transition-duration: 167ms;
  font-size: 16px;
  font-weight: 600;
  line-height: 30px;
  padding: 10px 24px;
  text-align: center;
  cursor: pointer;

  background-color: rgba(0, 0, 0, 0);
  &:hover {
    background-color: rgba(112, 181, 249, 0.15);
    color: #0a66c2;
    text-decoration: none;
  }
`;

const Section = styled.section`
  display: flex;
  align-items: center;
  align-content: start;
  min-height: 700px;
  padding-bottom: 138px;
  padding-top: 40px;
  padding: 60px 0;
  position: relative;
  flex-wrap: wrap;
  width: 100%;
  max-width: 1120px;
  align-items: center;
  margin: auto;
  @media (max-width: 768px) {
    margin: auto;
    min-height: 0px;
  }
`;

const Hero = styled.div`
  width: 100%;
  h1 {
    padding-bottom: 0;
    width: 55%;
    font-size: 56px;
    color: #2977c9;
    font-weight: 200;
    line-height: 70px;
    
    @media (max-width: 768px) {
      text-align: center;
      font-size: 20px;
      width: 100%;
      line-height: 2;
    }
  }
  img {
    /* z-index: -1; */
    width: 700px;
    height: 670px;
    position: absolute;
    bottom: -2px;
    right: -150px;
    @media (max-width: 768px) {
      top: 230px;
      width: initial;
      height: initial;
      position: initial;
    }
  }
`;

const Form = styled.div`
  margin-top: 100px;
  width: 408px;
  @media (max-width: 768px) {
    margin-top: 20px;
    width: 100%;
  }
`;

const Google = styled.button`
  display: flex;
  justify-content: center;
  background-color: #fff;
  align-items: center;
  font-weight: 500;
  width: 100%;
  height: 56px;
  border-radius: 28px;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 60%),
    inset 0 0 0 2px rgb(0 0 0 / 0%) inset 0 0 0 1px rgb(0 0 0 / 0%);
    vertical-align: middle;
    z-index: 0;
    transition-duration: 167ms;
    font-size: 20px;
    color: rgba(0,0,0,0.6);
    cursor: pointer;
    gap: 7px;

    &:hover{
    background-color: rgba(207, 207, 207 , 0.25);
    color: rgba(0,0,0,0.75);
    }
  img {
    width: 30px;
    height: 30px;
  }
`;



const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
}


const mapDispatchToProps = (dispatch) => ({
  signInAPI: ( ) => {
    dispatch(signInAPI());
  },
});


export default connect(mapDispatchToProps,mapStateToProps)(Login)

