import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
	deleteavatar,
	getuploadedavatar,
	getuserdetailsRoute,
	setAvatarRoute,
	uploadAvatar,
} from "../utils/APIRoutes";
import { BallTriangle, Oval } from "react-loader-spinner";
import { FaCheck, FaCheckCircle, FaTrash } from "react-icons/fa";

export default function SetAvatar() {
	const api = `https://api.multiavatar.com/4645646`;
	const navigate = useNavigate();
	const [user, setUser] = useState({});
	const [avatars, setAvatars] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isuploadloading, setisuploadloading] = useState(false);
	const [selectedAvatar, setSelectedAvatar] = useState(undefined);
	const toastOptions = {
		position: "top-right",
		autoClose: 3000,
		pauseOnHover: false,
		draggable: false,
		theme: "dark",
	};

	useEffect(async () => {
		if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
			navigate("/login");
	}, []);

	useEffect(() => {
		const findUser = async () => {
			const user = await JSON.parse(
				localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
			);
			setUser(user);
		};
		findUser();
	}, []);

	const setProfilePicture = async () => {
		if (selectedAvatar === undefined) {
			toast.error("Please select an avatar", toastOptions);
		} else {
			const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
				image: avatars[selectedAvatar],
			});

			if (data.isSet) {
				user.isAvatarImageSet = true;
				user.avatarImage = data.image;
				localStorage.setItem(
					process.env.REACT_APP_LOCALHOST_KEY,
					JSON.stringify(user)
				);
				navigate("/");
			} else {
				toast.error("Error setting avatar. Please try again.", toastOptions);
			}
		}
	};

	useEffect(() => {
		const loadImages = async () => {
			const data = [];
			setIsLoading(true);
			// try {
			// 	for (let i = 0; i < 4; i++) {
			// 		const image = await axios.get(
			// 			`${api}/${Math.round(Math.random() * 1000)}`
			// 		);
			// 		const buffer = new Buffer(image.data);
			// 		data.push("data:image/svg+xml;base64," + buffer.toString("base64"));
			// 	}
			// } catch (e) {
			// 	toast.error("Error in getting images", toastOptions);
			// }

			// get uploaded image
			const { data: uploadedImg } = await axios.get(
				`${getuploadedavatar}?userId=${user._id}`
			);
			data.push(...uploadedImg);
			setAvatars(data);

			setIsLoading(false);
		};
		if (user) loadImages();
	}, [user, api]);

	const handleSelectImg = (e) => {
		let img = e.target.files[0];
		if (!img) return;

		const reader = new FileReader();

		try {
			setisuploadloading(true);
			reader.onload = async () => {
				await axios.post(`${uploadAvatar}`, {
					userId: user?._id,
					image: reader.result,
				});

				const Updateduser = await axios.get(
					`${getuserdetailsRoute}?userId=${user._id}`
				);
				setUser(Updateduser?.data);
			};

			reader.readAsDataURL(img);
		} catch (error) {
			toast.error(error?.message, toastOptions);
		} finally {
			setisuploadloading(false);
		}
	};

	const handleDelete = async (imgindex) => {
		try {
			setIsLoading(true);
			const imgid = avatars[imgindex];
			await axios.delete(`${deleteavatar}`, {
				data: {
					userId: user._id,
					imgId: imgid,
				},
			});

			const Updateduser = await axios.get(
				`${getuserdetailsRoute}?userId=${user._id}`
			);
			setUser(Updateduser?.data);
			toast.success("Delete successfully", toastOptions);
		} catch (error) {
			toast.error("Coudn't delete", toastOptions);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			{isLoading ? (
				<Container>
					<BallTriangle
						height={100}
						width={100}
						radius={5}
						color='#4fa94d'
						ariaLabel='ball-triangle-loading'
						wrapperClass={{}}
						wrapperStyle=''
						visible={true}
					/>
				</Container>
			) : (
				<Container>
					<div className='title-container'>
						<h1>Pick an Avatar as your profile picture</h1>
					</div>
					<div className='avatars'>
						{avatars?.map((avatar, index) => {
							return (
								<div
									className={`avatar ${
										selectedAvatar === index ? "selected" : ""
									}`}
									onDoubleClick={() => {}}
									key={index}>
									<img src={`${avatar}`} alt='avatar' key={avatar} />
									<div className='delete'>
										<FaTrash onClick={() => handleDelete(index)} />
										<FaCheckCircle onClick={() => setSelectedAvatar(index)} />
									</div>
								</div>
							);
						})}
						<div className={`avatar`}>
							<div>
								<label htmlFor='addprofile'>
									{isuploadloading ? (
										<Oval
											height={30}
											width={30}
											color='#fff'
											visible={true}
											ariaLabel='oval-loading'
											secondaryColor='#ffffff81'
											strokeWidth={2}
											strokeWidthSecondary={2}
										/>
									) : (
										<span>+</span>
									)}
								</label>
								<input
									type='file'
									accept='image/*'
									name='Add profile picture'
									id='addprofile'
									className='appearance-none'
									onChange={handleSelectImg}
								/>
							</div>
						</div>
					</div>

					<button onClick={setProfilePicture} className='submit-btn'>
						Set as Profile Picture
					</button>
					<ToastContainer />
				</Container>
			)}
		</>
	);
}

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	gap: 3rem;
	background-color: #131324;
	height: 100vh;
	width: 100vw;

	.loader {
		max-inline-size: 100%;
	}

	.title-container {
		h1 {
			color: white;
		}
	}
	.avatars {
		display: flex;
		gap: 2rem;
		flex-wrap: wrap;

		.avatar {
			border: 0.4rem solid transparent;
			/* padding: 0.4rem; */
			border-radius: 5rem;
			display: flex;
			justify-content: center;
			align-items: center;
			transition: 0.5s ease-in-out;
			position: relative;

			.delete {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				background: rgba(0, 0, 0, 0.8);
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				gap: 10px;
				color: #4fa94d;
				font-size: 18px;
				transition: all 0.3s;
				transform: scale(0);

				* {
					cursor: pointer;
				}
			}

			&:hover .delete {
				transform: scale(1);
			}

			img {
				height: 100px;
				width: 100px;
				object-fit: cover;
				border-radius: 50%;
				transition: 0.5s ease-in-out;
			}

			label {
				display: block;
				height: 100px;
				width: 100px;
				border-radius: 50%;
				color: white;
				border: 2px solid white;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 45px;

				&:hover {
					cursor: pointer;
				}
			}

			input {
				display: none;
			}
		}
		.selected {
			border: 0.4rem solid #4fa94d;
		}
	}
	.submit-btn {
		background-color: #4fa94d;
		color: white;
		padding: 1rem 2rem;
		border: none;
		font-weight: bold;
		cursor: pointer;
		border-radius: 0.4rem;
		font-size: 1rem;
		text-transform: uppercase;
		&:hover {
			background-color: #4e0eff;
		}
	}
`;
