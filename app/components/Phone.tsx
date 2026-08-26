export type PhoneProps = {
  className: string;
  depth: number;
  tag: string;
  handle: string;
  caption: string;
  likes: string;
  comments: string;
};

export default function Phone({
  className,
  depth,
  tag,
  handle,
  caption,
  likes,
  comments,
}: PhoneProps) {
  return (
    <div className={`phone ${className}`} data-depth={depth}>
      <div className="scr">
        <div className="vid" />
        <div className="shine" />
        <div className="ph-tag">{tag}</div>
        <div className="ui">
          <div className="cap">
            <b>{handle}</b>
            <s>{caption}</s>
          </div>
          <div className="bars">
            <em>♥</em>
            <small>{likes}</small>
            <em>💬</em>
            <small>{comments}</small>
          </div>
          <div className="prg">
            <i />
          </div>
        </div>
      </div>
    </div>
  );
}
