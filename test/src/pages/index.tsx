import { trpc } from '../utils/trpc';
import type { NextPageWithLayout } from './_app';
import type { inferProcedureInput } from '@trpc/server';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import type { AppRouter } from '~/server/routers/_app';
import { detectOverflow } from 'runfix-container';
import { useEffect } from 'react';

const IndexPage: NextPageWithLayout = () => {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('ja');
  const [fontSize, setFontSize] = useState(16);
  const [overflowStates, setOverflowStates] = useState<Record<string, boolean>>(
    {},
  );

  const checkOverflow = (
    buttonId: string,
    buttonEl: HTMLButtonElement,
    containerEl: HTMLElement,
  ) => {
    const overflowStatus = detectOverflow(buttonEl, containerEl);
    setOverflowStates((prev) => ({
      ...prev,
      [buttonId]: overflowStatus.hasOverflow,
    }));
  };

  // Effect to check overflow whenever font size changes
  useEffect(() => {
    const containers = document.querySelectorAll('[data-overflow-container]');
    containers.forEach((container) => {
      const button = container.querySelector('button');
      const id = container.getAttribute('data-overflow-id');
      if (button && id) {
        checkOverflow(id, button, container as HTMLElement);
      }
    });
  }, [fontSize]);

  const languages = [
    { code: 'en', name: 'English with a very long name that should overflow' },
    {
      code: 'ja',
      name: '日本語は非常に長い名前で、オーバーフローするはずです',
    },
    { code: 'ko', name: '한국어는 매우 긴 이름으로 오버플로우해야 합니다' },
    { code: 'zh', name: '中文有一个很长的名字应该会溢出' },
    {
      code: 'es',
      name: 'Español con un nombre muy largo que debería desbordarse',
    },
    { code: 'fr', name: 'Français avec un nom très long qui devrait déborder' },
  ];

  // Test cases for different button sizes
  const buttonSizes = [
    { width: '100px', height: '40px' },
    { width: '150px', height: '30px' },
    { width: '80px', height: '50px' },
    { width: '120px', height: '35px' },
  ];
  const utils = trpc.useUtils();
  const postsQuery = trpc.post.list.useInfiniteQuery(
    {
      limit: 5,
    },
    {
      getNextPageParam(lastPage) {
        return lastPage.nextCursor;
      },
    },
  );

  const addPost = trpc.post.add.useMutation({
    async onSuccess() {
      // refetches posts after a post is added
      await utils.post.list.invalidate();
    },
  });

  // prefetch all posts for instant navigation
  // useEffect(() => {
  //   const allPosts = postsQuery.data?.pages.flatMap((page) => page.items) ?? [];
  //   for (const { id } of allPosts) {
  //     void utils.post.byId.prefetch({ id });
  //   }
  // }, [postsQuery.data, utils]);

  const translateTextHandler = () => {
    // Re-check all overflows
    const containers = document.querySelectorAll('[data-overflow-container]');
    containers.forEach((container) => {
      const button = container.querySelector('button');
      const id = container.getAttribute('data-overflow-id');
      if (button && id) {
        checkOverflow(id, button, container as HTMLElement);
      }
    });
  };
  return (
    <div className="flex flex-col bg-gray-800 py-8 gap-4">
      <div className="flex gap-4 items-center mb-4">
        <span>Font Size:</span>
        <input
          type="range"
          min="8"
          max="32"
          value={fontSize}
          onChange={(e) => setFontSize(parseInt(e.target.value))}
          className="w-48"
        />
        <span>{fontSize}px</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {buttonSizes.map((size, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div
              data-overflow-container
              data-overflow-id={`size-${index}`}
              style={{
                width: size.width,
                height: size.height,
                border: `1px solid ${overflowStates[`size-${index}`] ? 'red' : 'green'}`,
                padding: '4px',
                fontSize: `${fontSize}px`,
              }}
              className="relative"
            >
              <button
                className="w-full h-full bg-blue-600 rounded px-2 py-1"
                style={{ fontSize: 'inherit' }}
              >
                Test Button {index + 1}
              </button>
            </div>
            <span className="text-sm text-gray-400">
              Container: {size.width} x {size.height}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-4">
            {languages.map((lang) => (
              <div
                key={`source-${lang.code}`}
                className="relative"
                data-overflow-container
                data-overflow-id={`source-${lang.code}`}
                style={{
                  width: '200px',
                  height: '40px',
                  border: `1px solid ${overflowStates[`source-${lang.code}`] ? 'red' : 'green'}`,
                  padding: '4px',
                  fontSize: `${fontSize}px`,
                }}
              >
                <button
                  onClick={() => {
                    if (lang.code === targetLang) {
                      const oldSource = sourceLang;
                      setSourceLang(targetLang);
                      setTargetLang(oldSource);
                    } else {
                      setSourceLang(lang.code);
                    }
                  }}
                  className={`w-full h-full rounded-md font-semibold ${sourceLang === lang.code ? 'bg-blue-600' : 'bg-gray-700'}`}
                  style={{ fontSize: 'inherit' }}
                >
                  {lang.name}
                </button>
              </div>
            ))}
          </div>
          {/* Test Grid Layout */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="col-span-3 mb-4">
              <h2 className="text-xl font-semibold mb-2">Grid Layout Test</h2>
              <div className="grid grid-cols-3 gap-2">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="relative"
                    data-overflow-container
                    data-overflow-id={`grid-${i}`}
                    style={{
                      width: '100%',
                      height: '60px',
                      border: `1px solid ${overflowStates[`grid-${i}`] ? 'red' : 'green'}`,
                      padding: '4px',
                      fontSize: `${fontSize}px`,
                    }}
                  >
                    <button
                      className="w-full h-full bg-gray-700 rounded-md font-semibold"
                      style={{ fontSize: 'inherit' }}
                    >
                      {`Very Long Button Text ${i + 1} That Should Overflow`}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Narrow Container Test */}
            <div className="col-span-3 mb-4">
              <h2 className="text-xl font-semibold mb-2">
                Narrow Container Test
              </h2>
              <div className="flex gap-4">
                {[50, 80, 120].map((width) => (
                  <div
                    key={width}
                    className="relative"
                    data-overflow-container
                    data-overflow-id={`narrow-${width}`}
                    style={{
                      width: `${width}px`,
                      height: '40px',
                      border: `1px solid ${overflowStates[`narrow-${width}`] ? 'red' : 'green'}`,
                      padding: '4px',
                      fontSize: `${fontSize}px`,
                    }}
                  >
                    <button
                      className="w-full h-full bg-gray-700 rounded-md font-semibold"
                      style={{ fontSize: 'inherit' }}
                    >
                      Narrow Test
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Language Selection */}
            <div className="col-span-3">
              <h2 className="text-xl font-semibold mb-2">Target Language</h2>
              <div className="grid grid-cols-2 gap-4">
                {languages.map((lang) => (
                  <div
                    key={`target-${lang.code}`}
                    className="relative"
                    data-overflow-container
                    data-overflow-id={`lang-${lang.code}`}
                    style={{
                      width: '200px',
                      height: '40px',
                      border: `1px solid ${overflowStates[`lang-${lang.code}`] ? 'red' : 'green'}`,
                      padding: '4px',
                      fontSize: `${fontSize}px`,
                    }}
                  >
                    <button
                      onClick={() => {
                        if (lang.code === sourceLang) {
                          const oldTarget = targetLang;
                          setTargetLang(sourceLang);
                          setSourceLang(oldTarget);
                        } else {
                          setTargetLang(lang.code);
                        }
                      }}
                      disabled={lang.code === sourceLang}
                      className={`w-full h-full rounded-md font-semibold
                        ${targetLang === lang.code ? 'bg-blue-600' : 'bg-gray-700'}
                        ${lang.code === sourceLang ? 'opacity-50' : ''}`}
                      style={{ fontSize: 'inherit' }}
                    >
                      {lang.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <div
            className="relative"
            data-overflow-container
            data-overflow-id="translate-button"
            style={{
              width: '200px',
              height: '50px',
              border: `1px solid ${overflowStates['translate-button'] ? 'red' : 'green'}`,
              padding: '4px',
              fontSize: `${fontSize}px`,
            }}
          >
            <button
              onClick={translateTextHandler}
              className="w-full h-full bg-blue-600 rounded-md font-semibold"
              style={{ fontSize: 'inherit' }}
            >
              Translate Everything Now
            </button>
          </div>
        </div>
      </div>
      <p className="text-gray-400">
        If you get stuck, check{' '}
        <Link className="underline" href="https://trpc.io">
          the docs
        </Link>
        , write a message in our{' '}
        <Link className="underline" href="https://trpc.io/discord">
          Discord-channel
        </Link>
        , or write a message in{' '}
        <Link
          className="underline"
          href="https://github.com/trpc/trpc/discussions"
        >
          GitHub Discussions
        </Link>
        .
      </p>

      <div className="flex flex-col py-8 items-start gap-y-2">
        <div className="flex flex-col"></div>
        <h2 className="text-3xl font-semibold mb-4">
          Latest Posts
          {postsQuery.status === 'pending' && '(loading)'}
        </h2>

        <div
          className="relative"
          data-overflow-container
          data-overflow-id="load-more"
          style={{
            width: '180px',
            height: '40px',
            border: `1px solid ${overflowStates['load-more'] ? 'red' : 'green'}`,
            padding: '4px',
            fontSize: `${fontSize}px`,
          }}
        >
          <button
            onClick={() => postsQuery.fetchNextPage()}
            disabled={!postsQuery.hasNextPage || postsQuery.isFetchingNextPage}
            className="w-full h-full bg-gray-900 rounded-md font-semibold disabled:bg-gray-700 disabled:text-gray-400"
            style={{ fontSize: 'inherit' }}
          >
            {postsQuery.isFetchingNextPage
              ? 'Loading more...'
              : postsQuery.hasNextPage
                ? 'Load More'
                : 'Nothing more to load'}
          </button>
        </div>

        {postsQuery.data?.pages.map((page, index) => (
          <Fragment key={page.items[0]?.id || index}>
            {page.items.map((item) => (
              <article key={item.id}>
                <h3 className="text-2xl font-semibold">{item.title}</h3>
                <Link className="text-gray-400" href={`/post/${item.id}`}>
                  View more
                </Link>
              </article>
            ))}
          </Fragment>
        ))}
      </div>

      <hr />

      <div className="flex flex-col py-8 items-center">
        <h2 className="text-3xl font-semibold pb-2">Add a Post</h2>

        <form
          className="py-2 w-4/6"
          onSubmit={async (e) => {
            /**
             * In a real app you probably don't want to use this manually
             * Checkout React Hook Form - it works great with tRPC
             * @see https://react-hook-form.com/
             * @see https://kitchen-sink.trpc.io/react-hook-form
             */
            e.preventDefault();
            const $form = e.currentTarget;
            const values = Object.fromEntries(new FormData($form));
            type Input = inferProcedureInput<AppRouter['post']['add']>;
            //    ^?
            const input: Input = {
              title: values.title as string,
              text: values.text as string,
            };
            try {
              await addPost.mutateAsync(input);

              $form.reset();
            } catch (cause) {
              console.error({ cause }, 'Failed to add post');
            }
          }}
        >
          <div className="flex flex-col gap-y-4 font-semibold">
            <input
              className="focus-visible:outline-dashed outline-offset-4 outline-2 outline-gray-700 rounded-xl px-4 py-3 bg-gray-900"
              id="title"
              name="title"
              type="text"
              placeholder="This is a dummy placeholder that is super long for a demo and demo and demo"
              disabled={addPost.isPending}
            />
            <textarea
              className="resize-none focus-visible:outline-dashed outline-offset-4 outline-2 outline-gray-700 rounded-xl px-4 py-3 bg-gray-900"
              id="text"
              name="text"
              placeholder="Text"
              disabled={addPost.isPending}
              rows={6}
            />

            <div className="flex justify-center">
              <input
                className="cursor-pointer bg-gray-900 p-2 rounded-md px-16"
                type="submit"
                disabled={addPost.isPending}
              />
              {addPost.error && (
                <p style={{ color: 'red' }}>{addPost.error.message}</p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IndexPage;

/**
 * If you want to statically render this page
 * - Export `appRouter` & `createContext` from [trpc].ts
 * - Make the `opts` object optional on `createContext()`
 *
 * @see https://trpc.io/docs/v11/ssg
 */
// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ filter: string }>,
// ) => {
//   const ssg = createServerSideHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//   });
//
//   await ssg.post.all.fetch();
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       filter: context.params?.filter ?? 'all',
//     },
//     revalidate: 1,
//   };
// };
