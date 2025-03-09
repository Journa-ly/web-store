import { ImageResponse } from 'next/og';

export type Props = {
  title?: string;
};

export default async function OpengraphImage(props?: Props): Promise<ImageResponse> {
  const { title } = {
    ...{
      title: 'Journa'
    },
    ...props
  };

  return new ImageResponse(
    (
      <div tw="flex h-full w-full flex-col items-center justify-center bg-secondary">
        <div tw="flex flex-none items-center justify-center h-[160px] w-[500px]">
          {/* White Logo */}
          <img
            src="https://journa.ai/icon_white.svg"
            width="400"
            height="120"
            alt="Journa Logo"
            tw="object-contain"
          />
        </div>
        <p tw="mt-8 text-4xl font-bold text-white">{title}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: await fetch(new URL('../fonts/Inter-Bold.ttf', import.meta.url)).then((res) =>
            res.arrayBuffer()
          ),
          style: 'normal',
          weight: 700
        }
      ]
    }
  );
}
