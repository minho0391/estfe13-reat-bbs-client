import Button from "react-bootstrap/Button";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router";

const API_URL = import.meta.env.VITE_API_URL;

export default function View({ handleModify }) {
  const [content, setContent] = useState({
    writer: "",
    title: "",
    content: "",
    date: "",
    image: null,
  });
  const [isError, setIsError] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/view?id=${id}`)
      .then(response => {
        console.log(response.data); // [{...}]

        // data가 없거나 data 배열의 개수가 0이면
        if (!response.data || response.data.length === 0) {
          setIsError(true);
          return;
        }

        const data = response.data[0];

        setContent({
          writer: data.writer,
          title: data.title,
          content: data.content,
          date: data.date,
          image: data.image_path,
        });
      })
      .catch(error => {
        console.error(error);
        setIsError(true);
      })
      .finally(() => {
        console.log("요청완료");
      });
  }, [id]);

  if (isError) {
    return (
      <div>
        <p>잘못된 접근입니다.</p>
        <p>다시확인해주세요</p>
        <Link to="/" className="btn btn-primary">
          홈으로 이동
        </Link>
      </div>
    );
  }

  const handleClick = () => {
    handleModify(id);
  };

  const handleDelete = () => {
    if (window.confirm("정말 삭제할까요")) {
      axios
        .post(`${API_URL}/delete`, {
          id: id,
        })
        .then(() => {
          navigate("/");
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {});
    }
  };

  // 기존 DB 데이터가 절대경로여도,
  // 새 DB 데이터가 /uploads/파일명.jpg 형태여도,
  // 파일명만 뽑아서 정상 이미지 URL 생성
  const imageName = content.image ? content.image.split("/").pop() : null;
  const imageUrl = imageName ? `uploads/${imageName}` : null;

  return (
    <>
      <h2>{content.title}</h2>

      <div className="d-flex justify-content-between">
        <p>글쓴이: {content.writer}</p>
        <p>{content.date}</p>
      </div>

      <hr />

      <p>{content.content}</p>

      {imageUrl && (
        <div>
          <img src={imageUrl} alt={content.title} style={{ maxWidth: "80%" }} />
        </div>
      )}

      <hr />

      <div className="d-flex gap-1 justify-content-end">
        <Link to="/" className="btn btn-primary">
          홈
        </Link>

        <Button variant="secondary" onClick={handleClick}>
          수정
        </Button>

        <Button variant="danger" onClick={handleDelete}>
          삭제
        </Button>
      </div>
    </>
  );
}
