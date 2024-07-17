import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import LeftSide from './LeftSide';
import MainSide from './MainSide';
import RightSide from './RightSide';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from "react-router-dom";
import { connect } from 'react-redux';

function Home(props) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);


  console.log(user, "user home");

 
  return (
    <Container>
      {!user && <Navigate to="/" />}
      <Layout>
        <LeftSide />
        <MainSide />
        <RightSide />
      </Layout>
    </Container>
  );
};

const Container = styled.div`
  padding-top: 55px;
  max-width: 100%;
`;

const Layout = styled.div`
  padding: 0 75px;
  display: grid;
  grid-template-areas: "leftside main rightside";
  grid-template-columns: minmax(0, 1.9fr) minmax(0, 4fr) minmax(0, 2.5fr);
  column-gap: 25px;
  row-gap: 25px;
  margin: 25px 0;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    padding: 0px;
  }
`;

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Home);
