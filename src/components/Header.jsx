import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/Slices/userSlice";
import { signOutAPI } from "../firebase/functions";
import { Link } from "react-router-dom";

function Header(props) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { profilePicture, userProfile } = useSelector((state) => state.profile);
  const [showSignOut, setShowSignOut] = useState(false);

  const handleSignOutClick = () => {
    setShowSignOut(!showSignOut);
  };

  const handleSignOut = async () => {
    try {
      const signOut = await signOutAPI();
      if (signOut instanceof Error) {
        console.log(signOut.message);
      } else {
        dispatch(logout());
        console.log("Sign-out successful.");
      }
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  return (
    <Container>
      <Content>
        <Logo>
          <a href="/">
            <img src="/images/linkedin.png" alt="LinkedIn Logo" />
          </a>
        </Logo>
        <Search>
          <div>
            <input type="text" placeholder="Search" />
          </div>
          <SearchIcon>
            <img src="/images/search-icon.svg" alt="Search Icon" />
          </SearchIcon>
        </Search>
        <Nav>
          <NavListWrap>
            <Link to="/">
              <NavList className="active">
                <a title="Home">
                  <img src="/images/nav-home.svg" alt="Home Icon" />
                  <span>Home</span>
                </a>
              </NavList>
            </Link>
            <NavList>
              <a title="My Network">
                <img src="/images/nav-network.svg" alt="Network Icon" />
                <span>My Network</span>
              </a>
            </NavList>
            <NavList>
              <a title="Jobs">
                <img src="/images/nav-jobs.svg" alt="Jobs Icon" />
                <span>Jobs</span>
              </a>
            </NavList>
            <NavList>
              <a title="Messaging">
                <img src="/images/nav-messaging.svg" alt="Messaging Icon" />
                <span>Messaging</span>
              </a>
            </NavList>
            <NavList>
              <a title="Notifications">
                <img src="/images/nav-notifications.svg" alt="Notifications Icon" />
                <span>Notifications</span>
              </a>
            </NavList>
            <User>
              <a onClick={handleSignOutClick}>
                <img src={profilePicture || user?.photoURL || "/images/user.webp"} alt="Profile" />
                <span>
                  Me
                  <img src="/images/down-icon.svg" alt="Down Arrow" />
                </span>
          
              {showSignOut && (
                <SignOut>
                  <SignOutTop>
                    <div>
                      <img src={profilePicture || user?.photoURL || "/images/user.webp"} alt="Profile" />
                    </div>
                    <div>
                      <h1>{userProfile?.firstname || user?.displayName || "Sameer Khan"} {userProfile?.lastname}</h1>
                      <ul>
                        <li>{userProfile?.headline}</li>
                      </ul>
                    </div>
                  </SignOutTop>
                  <Link to="/profile">
                    <button>View Profile</button>
                  </Link>
                  <Link to="/login">
                  <a onClick={handleSignOut}>Sign Out</a>
                  </Link>
                </SignOut>
              )}
                  </a>
            </User>
            <Work>
              <a>
                <img src="/images/nav-work.svg" alt="Work Icon" />
                <span>
                  Work <img src="/images/down-icon.svg" alt="Down Arrow" />
                </span>
              </a>
            </Work>
          </NavListWrap>
        </Nav>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  left: 0;
  padding: 5px 4px;
  position: fixed;
  top: 0px;
  width: 100vw;
  z-index: 100;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    /* padding: 0 100px; */
  }
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;
  min-height: 100%;
  max-width: 1108px;
  padding-right: 85px;
  @media (max-width: 768px) {
    padding-right: 0px;
  }
`;

const Logo = styled.span`
  margin-right: 5px;
  font-size: 0px;
  img {
    width: 34px;
  }
`;

const Search = styled.div`
  opacity: 1;
  flex-grow: 1;
  position: relative;
  /* background-color: red; */
  @media (max-width: 768px) {
    margin-right: 35px;
  }

  & > div {
    max-width: 280px;
    input {
      border: none;
      box-shadow: none;
      background-color: #eef3f8;
      border-radius: 2px;
      color: rgba(0, 0, 0, 0.9);
      width: 218px;
      padding: 0 8px 0 40px;
      line-height: 1.75;
      font-weight: 400;
      font-size: 14px;
      height: 34px;
      border-color: #dce6f1;
      vertical-align: text-top;
      @media (max-width: 768px) {
        display: none;
      }
    }
  }
`;

const SearchIcon = styled.div`
  width: 40px;
  position: absolute;
  top: 10px;
  left: 2px;
  z-index: 1;
  border-radius: 0 2px 2px 0;
  margin: 0;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.15s;
  @media (max-width: 768px) {
    top: -5px;
  }
`;

const Nav = styled.nav`
  margin-left: auto;
  display: block;
  @media (max-width: 768px) {
    top: 0;
    background: white;
    width: 100%;
  }
`;

const NavListWrap = styled.ul`
  display: flex;
  flex-wrap: nowrap;
  list-style-type: none;
  .active {
    span:after {
      content: "";
      transform: scaleX(1);
      border-bottom: 2px solid var(--white, #fff);
      bottom: 0;
      left: 0;
      position: absolute;
      transition: transform 0.2s ease-in-out;
      width: 100%;
      border-color: rgba(0, 0, 0, 0.9);
    }
  }
`;

const NavList = styled.li`
  display: flex;
  align-items: center;

  a {
    align-items: center;
    background: transparent;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    font-weight: 400;
    justify-content: center;
    line-height: 1.5;
    min-height: 42px;
    min-width: 80px;
    position: relative;
    text-decoration: none;
    cursor: pointer;
    span {
      color: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      @media (max-width: 768px) {
        display: none;
      }
    }
    @media (max-width: 768px) {
      min-width: 70px;
    }
    @media (max-width: 485px) {
      min-width: 50px;
    }
    @media (max-width: 485px) {
      min-width: 40px;
    }
  }
  &:hover,
  &:active {
    a {
      span {
        color: rgba(0, 0, 0, 0.9);
      }
    }
  }
`;
const SignOut = styled.div`
  position: absolute;
  top: 65px;
  right: 3px;
  background: white;
  border-radius: 0 0 5px 5px;
  font-size: 16px;
  transition-duration: 167ms;
  border-radius: 10px 0px 10px 0px ;
  border: 1px solid black;
  button{
  background: white;
  width: 95%;
  border-radius: 10px;
  border: 2px solid #38acff;
margin:5px ;
padding: 4px;
color: #38acff;
cursor: pointer !important;
;

}
  a {
    cursor: pointer !important;
    border-top: 1px solid #b4b3b3;
    display: flex;
    align-items: flex-start;
    padding-left: 10px;
  }
`;
const SignOutTop = styled.div`
display: flex;
width:250px;
padding: 10px;


img{
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}
h1{
  margin-top: 10px;
  margin-left: 15px;
  font-size: 18px;
}
ul{
  margin-left: 15px;
  li{
    list-style: none;
    font-size: 14px;
  }
}

`

const User = styled(NavList)`
  a > svg {
    width: 24px;
    border-radius: 50%;
  }

  a > img {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    object-fit: cover;
  }
  span {
    display: flex;
    align-items: center;
  }
`;
const Work = styled(User)`
  border-left: 1px solid rgba(0, 0, 0, 0.08);
  @media (max-width: 768px) {
    display: none;
  }
`;

export default Header;
