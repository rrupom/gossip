import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [serachText, setSearchText] = useState("");
  const [searchResultContacts, setSearchResultContacts] = useState([contacts]);

  const navigate = useNavigate();

  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    setCurrentUserName(data.username);
    setCurrentUserImage(data.avatarImage);
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
    setSearchText("");
  };

  useEffect(() => {
    const filteredRes = contacts.filter((v) =>
      v?.username?.includes(serachText)
    );
    setSearchResultContacts(filteredRes);
  }, [serachText, contacts]);

  return (
    <>
      {currentUserImage && currentUserImage && (
        <Container>
          <div className="brand">
            {/* <img src={Logo} alt='logo' /> */}
            <h3>Gossip</h3>
          </div>
          <div className="search">
            <input
              type="search"
              autoComplete={false}
              placeholder="Search By username"
              value={serachText}
              onChange={(e) => setSearchText(e.target.value)}
              id="searchbox"
            />
            {/* <label htmlFor='searchbox'>
							<FaSearch />
						</label> */}
          </div>
          <div className="contacts">
            {searchResultContacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    <img src={`${contact.avatarImage}`} alt="" />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="current-user" onClick={() => navigate("/setAvatar")}>
            <div className="avatar">
              <img src={`${currentUserImage}`} alt="avatar" />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 10% 65% 15%;
  grid-row-gap: 10px;
  overflow: hidden;
  background-color: #080420;
  padding-bottom: 20px;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }

  .search {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 0 10px;

    input {
      padding: 10px 10px;
      height: max-content;
      font-size: 16px;
      flex-grow: 1;
      border-radius: 5px;

      &:focus {
        outline: none;
      }
    }

    label {
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 5px;
      cursor: pointer;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      overflow-y: auto;

      .avatar {
        img {
          height: 50px;
          width: 50px;
          border-radius: 50%;
          object-fit: cover;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    cursor: pointer;

    .avatar {
      img {
        height: 60px;
        width: 60px;
        border-radius: 50%;
        object-fit: cover;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;
