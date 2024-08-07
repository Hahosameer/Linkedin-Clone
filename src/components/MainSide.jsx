import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import SmsIcon from "@mui/icons-material/Sms";
import RepeatIcon from "@mui/icons-material/Repeat";
import SendIcon from "@mui/icons-material/Send";
import TransitionsModal from "./PostModal";
import { useDispatch, useSelector } from "react-redux";
import ReactPlayer from "react-player";
import {
  getAllDataOrderedByTimestamp,
  uploadImage,
  addInDB,
} from "../firebase/functions";
import {
  getArticlePending,
  getArticleSuccess,
  getArticleFailure,
  postArticlePending,
  postArticleSuccess,
  postArticleFailure,
} from "../Redux/Slices/AriticleSlice";
import { Link } from "react-router-dom";

// Description component with "See more" functionality
const Description = ({ text }) => {
  const [showFull, setShowFull] = useState(false);

  const toggleShowFull = () => {
    setShowFull(!showFull);
  };

  return (
    <DescriptionContainer>
      {showFull ? (
        <p>{text}</p>
      ) : (
        <p style={{ display: "flex" }}>
          {text.slice(0, 30)}{" "}
          {text.length > 30 && (
            <SeeMore onClick={toggleShowFull}>See more</SeeMore>
          )}
        </p>
      )}
    </DescriptionContainer>
  );
};

const DescriptionContainer = styled.div`
  margin-top: 10px;
  padding: 0 16px;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.9);
  font-size: 14px;
  text-align: left;
  /* background-color: red; */
`;

const SeeMore = styled.span`
  color: blue;
  cursor: pointer;
`;

function MainSide() {
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editorText, setEditorText] = useState("");
  const [sharedImage, setSharedImage] = useState(null);
  const { user, loading } = useSelector((state) => state.user);
  const { article, loading: articleLoading } = useSelector((state) => state.article);
  const profilePicture = useSelector((state) => state.profile.profilePicture);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(false);
  const [showShareBoxTop, setShowShareBoxTop] = useState(true);
  const dispatch = useDispatch();

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const toggleLike = () => {
    if (liked) {
      // If already liked, decrease likeCount
      setLikeCount(Math.max(0, likeCount - 1)); // Ensure likeCount doesn't go below 0
      setLiked(false);
      // Here you would typically update your backend or Redux store with the unlike action
    } else {
      // If not liked, increase likeCount
      setLikeCount(likeCount + 1);
      setLiked(true);
      // Here you would typically update your backend or Redux store with the like action
    }
  };
  
  const getGivenName = (displayName) => {
    if (!displayName) return "";
    const names = displayName.split(" ");
    const familyNames = ["Khan", "Smith", "Johnson"];
    return names.find((name) => !familyNames.includes(name)) || names[0];
  };

  useEffect(() => {
    const getPosts = async () => {
      setLoadingPosts(true);
      dispatch(getArticlePending());
      try {
        const result = await getAllDataOrderedByTimestamp("posts");
        if (result instanceof Error) {
          dispatch(getArticleFailure(result.message));
        } else {
          dispatch(getArticleSuccess(result.data));
        }
      } catch (error) {
        console.log(error);
        dispatch(getArticleFailure(error.message));
      } finally {
        setLoadingPosts(false);
      }
    };
    getPosts();
  }, [dispatch]);

  const postHandler = async () => {
    try {
      handleCloseModal();
      dispatch(postArticlePending());

      const currentUser = {
        name: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
        email: user.email,
      };

      let post = {
        user: currentUser,
        description: editorText,
        timestamp: Date.now(),
        likes: [],
        comments: [],
        id: Date.now(),
      };

      if (sharedImage) {
        const imageName = `${Date.now()}_${sharedImage.name}`;
        setUploadingImage(true);

        const imageUrl = await uploadImage(sharedImage, imageName);

        setUploadingImage(false);

        if (imageUrl) {
          post.image = imageUrl;
        }
      }

      await addInDB(post);
      dispatch(postArticleSuccess(post));
      setEditorText("");
      setSharedImage(null);
    } catch (error) {
      console.error("Error posting:", error);
      dispatch(postArticleFailure(error.message));
    }
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      setShowShareBoxTop(false);
    }, 15000); // 15000ms = 15 seconds

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  return (
    <Container>
      {showShareBoxTop && (
        <ShareBoxTop>
          <div>
          <img src={profilePicture ||  "/images/user.webp"} alt="" />
            <h3>Hi {getGivenName(user?.displayName)}, are you hiring?</h3>
            <p>Discover free and easy ways to find a great hire, fast.</p>
            <HiringBtn>
              <button>Yes, I'm hiring</button>
              <button>No, not right now</button>
            </HiringBtn>
          </div>
        </ShareBoxTop>
      )}
      <ShareBox>
        <div >
        <Link to={`/profile/${user?.uid}`}>
      <img src={profilePicture || user?.photoURL || "/images/user.webp"} alt="" />
          </Link>
          <button onClick={handleOpenModal}>Start a Post</button>
        </div>
        <div>
          <button onClick={handleOpenModal}>
            <img src="/images/photo-icon.png" width="23" alt="" />
            <span>Media</span>
          </button>
          <button>
            <img src="/images/event-icon.png" width="20" alt="" />
            <span>Event</span>
          </button>
          <button>
            <img src="/images/article-icon.png" width="15" alt="" />
            <span>Write article</span>
          </button>
        </div>
      </ShareBox>
      <Content>
        {loadingPosts && <img src="/images/loder.gif" alt="Loading..." />}
        {article ? (
          article.length > 0 ? (
            article
              .slice()
              .reverse()
              .map((article, index) => (
                <Article key={index}>
                  <SharedActor>
                    <a>
                
                      <Link to={`/profile/${article?.user?.uid}`}>
                    <img src={article?.user?.photoURL || profilePicture  || "/images/user.webp"} alt="" />
                      </Link>
                   <div>

                        <span>{article.user.name}</span>
                        <span>
                          {new Date(parseInt(article.timestamp))
                            .toLocaleString()
                            .slice(0, 10)}
                        </span>
                            </div>
                     
                    </a>
                    <button>
                      <img src="/images/ellipsis.png" width="25" alt="" />
                    </button>
                  </SharedActor>
                  <Description text={article.description} />
                  <SharedImg>
                    <a>
                      {!article.image && article.video ? (
                        <ReactPlayer
                          url={article.video}
                          width="100%"
                          controls
                        />
                      ) : !article.video && article.image ? (
                        <img src={article.image} alt="" />
                      ) : null}
                    </a>
                  </SharedImg>
                  <SocialCounts>
                    <li>
                      <button
                        onClick={() =>
                          handleLike(article.id, article.likeCount)
                        }
                      >
                        <img
                          src="/images/like.png"
                          width="15"
                          alt=""
                          style={{ marginRight: "1px", cursor: "pointer" }}
                        />
                        <img src="/images/heart.png" width="15" alt="" />
                       <span>{isNaN(likeCount) ? 0 : likeCount}</span>

                      </button>
                    </li>
                    <li>
                      {/* <a>{article.commentCount} comments</a> */}
                    </li>
                  </SocialCounts>
                  <SocialActions>
                    <button onClick={toggleLike}>
                     {likeCount ?   <img src="/images/like.png" width="20" alt="" /> : <ThumbUpOffAltIcon />}
                      <span>Like</span>
                    </button>
                    <button>
                      <SmsIcon />
                      <span>Comments</span>
                    </button>
                    <button>
                      <RepeatIcon />
                      <span>Repost</span>
                    </button>
                    <button>
                      <SendIcon />
                      <span>Send</span>
                    </button>
                  </SocialActions>
                </Article>
              ))
          ) : (
            <p></p>
          )
        ) : (
          <p></p>
        )}
      </Content>
      <TransitionsModal
        open={modalOpen}
        handleClose={handleCloseModal}
        postHandler={postHandler}
        uploadingImage={uploadingImage}
      />
    </Container>
  );
}

const Container = styled.div`
  grid-area: main;
`;

const CommonCard = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 5px;
  position: relative;
  border: none;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
  @media (max-width: 768px) {
    border-radius: 0px;
  }
`;
const ShareBoxTop = styled(CommonCard)`
  div {
    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin-top: 8px;
      object-fit: cover;
      cursor: pointer;
    }
    h3 {
      font-weight: 300;
    }
    p {
      padding: 10px;
    }
    button {
      padding: 5px 20px;
      width: 180px;
      margin: 10px 10px;
      border-radius: 30px;
      outline: 0;
      border: none;
      border: 2px solid #d1c9c9;
     
      &:hover {
        background-color: #f3f3f3;
        border: 2px solid #38acff;
        cursor: pointer;
      }
    }
  }
`;
const ShareBox = styled(CommonCard)`
  display: flex;
  flex-direction: column;
  color: #958b7b;
  margin: 0 0 8px;
  background-color: white;
  div {
    button {
      outline: none;
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
      line-height: 1.5;
      min-height: 48px;
      background: transparent;
      border: none;
      display: flex;
      align-items: center;
      font-weight: 600;
      padding: 0 10px;
      &:hover {
        background-color: #f3f3f3;
        cursor: pointer;
        padding: 0 10px;
      }
    }
    &:first-child {
      display: flex;
      align-items: center;
      padding: 8px 16px 0px 16px;
      img {
        width: 48px;
        height: 48px;
        object-fit: cover;
        border-radius: 50%;
        margin-right: 8px;

      }
      button {
        margin: 4px 0;
        flex-grow: 1;
        border-radius: 35px;
        padding-left: 16px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        background-color: white;
        text-align: left;
        &:hover {
          background-color: #f3f3f3;
          transition: 0.5s;
        }
      }
    }
    &:nth-child(2) {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      padding-bottom: 4px;
      button {
        img {
          margin: 0 4px 0 -2px;
        }
        span {
          color: #000;
        }
      }
    }
  }
`;

const Article = styled(CommonCard)`
  padding: 0;
  margin: 0 0 8px;
  overflow: visible;
`;

const SharedActor = styled.div`
  padding-right: 40px;
  flex-wrap: nowrap;
  padding: 12px 16px 0;
  margin-bottom: 8px;
  align-items: center;
  display: flex;
  border-bottom: 0.5px solid #f3f3f3;
  button {
    padding: 20px 10px;
  }
  a {
    margin-right: 12px;
    flex-grow: 1;
    display: contents;
    text-decoration: none;
    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
      cursor: pointer;
    }
    & > div {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      flex-basis: 0;
      margin-left: 8px;
      overflow: hidden;
      span {
        text-align: left;
        &:first-child {
          font-size: 14px;
          font-weight: 700;
          color: rgba(0, 0, 0, 1);
          margin-bottom: 10px;
          margin-top: 5px;
        }
        &:nth-child(2) {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.6);
        }
      }
    }
  }
  button {
    position: absolute !important;
    right: 12px !important;
    top: 0 !important;
    background: transparent !important;
    border: none !important;
    outline: none !important;
  }
`;


const SharedImg = styled.div`
  margin-top: 8px;
  width: 100%;
  display: block;
  position: relative;
  background-color: #f9fafb;
  img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
`;

const SocialCounts = styled.ul`
  line-height: 1.3;
  display: flex;
  align-items: flex-start;
  overflow: auto;
  margin: 0 16px;
  padding: 8px 0;
  border-bottom: 1px solid #e9e5df;
  list-style: none;
  li {
    margin-right: 5px;
    font-size: 12px;
    button {
      display: flex;
      border: none;
      background: white;
    }
    span {
      margin-left: 2px;
      color: rgba(0, 0, 0, 0.6);
      margin-top: 1px !important;
    }
  }
`;

const SocialActions = styled.div`
  display: flex;
  align-items: center;
  margin: 0px 3px;
  button {
    width: 100%;
    border: none;
    border-top: 1px solid 1px grey;
    padding: 10px 8px;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 3px;
    cursor: pointer;
    &:hover {
      background-color: #f3f3f3;
    }
  }
`;
const HiringBtn = styled.div``;

const Content = styled.div`
  text-align: center;
  & > img {
    width: 30px;
  }
  span {
    display: block;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
    margin-top: 0px;
  }
`;




export default MainSide;
