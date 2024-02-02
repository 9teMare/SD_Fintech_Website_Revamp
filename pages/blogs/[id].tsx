import { ArrowBackIcon } from '@chakra-ui/icons';
import { PostData, getPostById } from 'lib/posts';
import { GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import sizeOf from 'image-size';
import { join } from 'path';

type Props = {
  postData: PostData;
  imageSizes: Record<string, { width?: number; height?: number }>;
};

export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
  return {
    paths: [
      {
        params: {
          id: 'fintech_summit_2024',
        },
      },
    ],
    fallback: true,
  };
};

export async function getStaticProps({ params }: { params: { id: string } }) {
  const postData = await getPostById(params.id);
  const imageSizes: Props['imageSizes'] = {};

  // A regular expression to iterate on all images in the post
  const iterator = postData.content.matchAll(/\!\[.*]\((.*)\)/g);
  let match: IteratorResult<RegExpMatchArray, any>;
  while (!(match = iterator.next()).done) {
    let [, src] = match.value;
    src = src.replace('</', '').replace('>', '');
    try {
      // Images are stored in `public`
      const { width, height } = sizeOf(join('public', src));
      imageSizes['/' + src] = { width, height };
    } catch (err) {
      console.error(`Can't get dimensions for ${src}:`, err);
    }
  }

  return {
    props: {
      postData,
      imageSizes,
    },
  };
}

export default function Post({ postData, imageSizes }: Props) {
  const router = useRouter();

  return (
    <section className="my-16 flex items-start justify-center">
      <button
        className="absolute left-[15%] items-center justify-center text-xl font-semibold"
        onClick={() => router.back()}
      >
        <ArrowBackIcon fontSize="5xl" />
        Back
      </button>
      <div className="w-[40%] text-2xl">
        <h1 className="text-5xl font-bold">{postData.title}</h1>
        <br />
        <h2 className="text-3xl font-semibold">{postData.date}</h2>
        <br />

        <ReactMarkdown
          skipHtml={true}
          className="items-center justify-center leading-10"
          components={{
            img: (props) => {
              const { src, alt } = props;
              if (imageSizes[src!]) {
                const { width, height } = imageSizes[src!];
                return (
                  <Image src={src!} alt={alt} width={width} height={height} />
                );
              } else {
                return <img {...props} alt={props.alt} />;
              }
            },
            em: (props) => {
              const { node, ...rest } = props;
              return (
                <i
                  style={{
                    alignSelf: 'center',
                    fontSize: '16px',
                    lineHeight: '0.5',
                  }}
                  {...rest}
                />
              );
            },
          }}
        >
          {postData.content}
        </ReactMarkdown>
      </div>
    </section>
  );
}
