import React from "react";
import { Tag } from "antd";
const { CheckableTag } = Tag;
type TagsProps = {
  allTags: string[];
  includedTags: Set<string>;
  toggleTag: (checked: boolean, tag: string) => void;
};
const Tags: React.FC<TagsProps> = ({
  allTags,
  includedTags,
  toggleTag
}): JSX.Element => {
  return (
    <>
      {allTags.map(tag => (
        <CheckableTag
          key={tag}
          checked={includedTags.has(tag)}
          onChange={checked => toggleTag(checked, tag)}
        >
          {tag}
        </CheckableTag>
      ))}
    </>
  );
};

export default Tags;
