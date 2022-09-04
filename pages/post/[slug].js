import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import imageUrlBuilder from "@sanity/image-url";
import BlockContent from "@sanity/block-content-to-react";
import styles from "../../styles/Post.module.css";

function Post({ title, body, image }) {
  const [imageUrl, setImageUrl] = useState();
  const router = useRouter();
  useEffect(() => {
    const imgBuilder = imageUrlBuilder({
      projectId: "dlwalt36",
      dataset: "production",
    });
    setImageUrl(imgBuilder.image(image));
  }, [image]);
  // console.log(title, image, body);

  return (
    <div className={styles.main}>
      <div className={styles.nav} onClick={() => router.push("/")}>
        Back to posts
      </div>
      <h1>{title}</h1>
      {imageUrl && <img src={imageUrl} alt={title} />}
      <div className={styles.body}>
        <BlockContent blocks={body} />
      </div>
    </div>
  );
}
export const getServerSideProps = async (pageContext) => {
  const pageSlug = pageContext.query.slug;
  // console.log(pageSlug);
  if (!pageSlug) {
    return {
      notFound: true,
    };
  }
  const particularPost = encodeURIComponent(
    `*[ _type == "post" && slug.current == "${pageSlug}" ]`
  );
  const url = `https://dlwalt36.api.sanity.io/v1/data/query/production?query=${particularPost}`;

  const postData = await fetch(url).then((res) => res.json());
  const postItem = postData.result[0];
  if (!postItem) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: {
        title: postItem.title,
        image: postItem.mainImage,
        body: postItem.body,
      },
    };
  }
};
export default Post;
