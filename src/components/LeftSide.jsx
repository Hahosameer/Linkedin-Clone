import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Link } from 'react-router-dom';

function LeftSide(props) {
  const { user } = useSelector((state) => state.user);
  const { profilePicture, coverPicture, userProfile } = useSelector((state) => state.profile);
  console.log(user, "left user");
console.log(coverPicture , "coverPicture");
console.log(userProfile , "userProfile llllllllllllll");
  return (
    <Container>
      <ArtCard>
        <UserInfo>
          <CardBackground>
          <img src={coverPicture || "/images/card-bg.svg"} alt="Cover Background" />
          </CardBackground>
          <Link to="/profile">
            <Photo>
            <img
                src={profilePicture || user?.photoURL || "/images/user.webp"}
                alt="Profile"
              />
            </Photo>
          </Link>
          <Links>
            { userProfile?.firstname ||  user?.displayName || "Sameer Khan"} {userProfile?.lastname}
          </Links>
          <a>
            <AddPhotoText>
              <ul>
                <li>
                {userProfile.headline}
                </li>
              </ul>
            </AddPhotoText>
          </a>
        </UserInfo>
        <Widget>
          <a>
            <div>
              <span>Connections</span>
              <span>Grow your network</span>
            </div>
            <img src="/images/widget-icon.svg" alt="widget-icon" />
          </a>
        </Widget>
        <Item>
          <span>
            <img src="/images/item-icon.svg" alt="item-icon" />
            My Items
          </span>
        </Item>
      </ArtCard>
      <CommunityCard>
        <a>
          <span>Groups</span>
        </a>
        <a>
          <span>
            Events
            <img src="/images/plus-icon.svg" alt="plus-icon" />
          </span>
        </a>
        <a>
          <span>Follow Hashtags</span>
        </a>
        <a>
          <span>Discover more</span>
        </a>
      </CommunityCard>
    </Container>
  );
}

const Container = styled.div`
  grid-area: leftside;
`;
const ArtCard = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 5px;
  transition: box-shadow 83ms;
  position: relative;
  border: none;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
  @media (max-width: 768px) {
    border-radius: 0px;
  }
`;

const UserInfo = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  padding: 12px 12px 16px;
  word-wrap: break-word;
  word-break: break-word;

`;
const CardBackground = styled.div`
  img{
width: 100%;
    height: 54px;
    object-fit: cover;
    @media (max-width:769px) {

height: 180px;
}
  }
  margin: -12px -12px 0;
`;
const Photo  = styled.div`
img{

  width: 72px;
  height: 72px;
  box-sizing: border-box;
  background-clip: content-box;
  background-color: white;
  background-position: center;
  background-size: 60%;
  background-repeat: no-repeat;
  border: 2px solid white;
  margin: -38px auto 12px;
  border-radius: 50%;
  object-fit: cover;
  @media (max-width:769px) {
    margin: -78px auto 12px;
    width: 152px;
    height: 152px;
   
}
}

`
const Links = styled.div`
  font-size: 16px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.9);
  font-weight: 600;
  text-decoration: none;
  text-transform: capitalize;
  /* margin-top: 50px; */
`;
const AddPhotoText = styled.div`
  color: #b3b1b1;
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.33;
  font-weight: 400;
  ul{
    li{
      font-size: 12px;
      list-style: none;
    }
  }
`;
const Widget = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  padding-top: 12px;
  padding-bottom: 12px;

  & > a {
    text-decoration: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 12px;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }

  div {
    display: flex;
    flex-direction: column;
    text-align: left;
    span {
      font-size: 12px;
      line-height: 1.333;
      &:first-child {
        color: rgba(0, 0, 0, 0.6);
      }
      &:nth-child(2) {
        color: rgba(0, 0, 0, 1);
      }
    }
  }

  svg {
    color: rgba(0, 0, 0, 1);
  }
`;
const Item = styled.a`
  border-color: rgba(0, 0, 0, 0.8);
  text-align: left;
  padding: 12px;
  font-size: 12px;
  display: block;
  span {
    display: flex;
    align-items: center;
    color: rgba(0, 0, 0, 1);
    svg {
      color: rgba(0, 0, 0, 0.6);
    }
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;
const CommunityCard = styled(ArtCard)`
  padding: 8px 0 0;
  text-align: left;
  display: flex;
  flex-direction: column;
  a {
    color: black;
    padding: 4px 12px 4px 12px;
    font-size: 12px;
    &:hover {
      color: #0a66c2;
    }

    span {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &:last-child {
      color: rgba(0, 0, 0, 0.6);
      text-decoration: none;
      border-top: 1px solid #d6cec2;
      padding: 12px;
      &:hover {
        background-color: rgba(0, 0, 0, 0.08);
      }
    }
  }
`;
export default LeftSide;
