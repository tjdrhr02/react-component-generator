import { LiveProvider, LivePreview as ReactLivePreview, LiveError } from 'react-live';

type Viewport = 'mobile' | 'tablet' | 'desktop';

interface LivePreviewProps {
  code: string;
  viewport?: Viewport;
}

const VIEWPORT_WIDTHS: Record<Viewport, string> = {
  mobile: '375px',
  tablet: '768px',
  desktop: '100%',
};

export function LivePreview({ code, viewport = 'desktop' }: LivePreviewProps) {
  const width = VIEWPORT_WIDTHS[viewport];
  return (
    <div className="preview-panel">
      <div className="preview-content">
        <LiveProvider code={code} noInline>
          <div className="preview-viewport-wrapper">
            <div className="preview-render" style={{ width, flexShrink: 0 }}>
              <ReactLivePreview />
            </div>
          </div>
          <LiveError className="preview-error" />
        </LiveProvider>
      </div>
    </div>
  );
}
