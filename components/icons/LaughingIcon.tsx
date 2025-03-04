import * as React from 'react';

interface LaughingIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
  titleId?: string;
}

function LaughingIcon(
  { title, titleId, ...props }: LaughingIconProps,
  svgRef: React.Ref<SVGSVGElement>
) {
  return /*#__PURE__*/ React.createElement(
    'svg',
    Object.assign(
      {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        strokeWidth: 1.5,
        'aria-hidden': 'true',
        'data-slot': 'icon',
        ref: svgRef,
        'aria-labelledby': titleId
      },
      props
    ),
    title
      ? /*#__PURE__*/ React.createElement(
          'title',
          {
            id: titleId
          },
          title
        )
      : null,
    // Yellow face background
    /*#__PURE__*/ React.createElement('circle', {
      cx: '12',
      cy: '12',
      r: '10',
      fill: '#FFDE34',
      stroke: '#333333',
      strokeWidth: '1'
    }),
    // Laughing mouth
    /*#__PURE__*/ React.createElement('path', {
      fill: '#FFFFFF',
      stroke: '#333333',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      d: 'M12 18c1.896 0 3.489-1.28 3.936-3.01c.208-.805-.094-.99-.89-.99H8.954c-.796 0-1.098.185-.89.99C8.51 16.72 10.104 18 12 18'
    }),
    // Left eye - squinting
    /*#__PURE__*/ React.createElement('path', {
      fill: 'none',
      stroke: '#333333',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeWidth: '1.2',
      d: 'M7 9.5a1.5 1.5 0 1 1 3 0'
    }),
    // Right eye - squinting
    /*#__PURE__*/ React.createElement('path', {
      fill: 'none',
      stroke: '#333333',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeWidth: '1.2',
      d: 'M14 9.5a1.5 1.5 0 0 1 3 0'
    }),
    // Left tear
    /*#__PURE__*/ React.createElement('path', {
      fill: '#88C9F9',
      stroke: '#333333',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      d: 'M6 12c-1.555.399-4.459 1.234-3.938 3.782c.268 1.26 1.675 1.493 2.438.926C6.338 15.343 4.5 14 6 12'
    }),
    // Right tear
    /*#__PURE__*/ React.createElement('path', {
      fill: '#88C9F9',
      stroke: '#333333',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      d: 'M18 12c1.555.399 4.459 1.234 3.938 3.782c-.268 1.26-1.674 1.493-2.438.926C17.662 15.343 19.5 14 18 12'
    })
  );
}

const ForwardRef = React.forwardRef<SVGSVGElement, LaughingIconProps>(LaughingIcon);
export default ForwardRef;
