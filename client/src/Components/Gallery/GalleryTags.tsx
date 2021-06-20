import React, { useState, useMemo } from "react";
import { LabelAndAmount } from "./Gallery";
import { Tag, Slider } from "antd";
import { SliderMarks } from "antd/lib/slider";
const { CheckableTag } = Tag;

const DEFAULT_THRESHOLD = 5;

type TagsProps = {
  allTags: LabelAndAmount[];
  includedTags: Set<string>;
  toggleTag: (checked: boolean, tag: string) => void;
  showLimiter?: boolean;
};
const Tags: React.FC<TagsProps> = ({
  allTags,
  includedTags,
  toggleTag,
  showLimiter = true
}): JSX.Element => {
  const [threshold, setThreshold] = useState<number>(DEFAULT_THRESHOLD);
  const handleThresholdChange = (x: any): void => {
    setThreshold(x);
  };

  const tagsAboveThreshold: string[] = useMemo(() => {
    let tags: string[] = [];
    if (showLimiter) {
      tags = allTags
        .filter(({ amount }) => amount >= threshold)
        .map(({ label }) => label);
    } else {
      tags = allTags.map(({ label }) => label);
    }
    return tags;
  }, [allTags, threshold, showLimiter]);

  const marks: SliderMarks = useMemo(
    () =>
      allTags.reduce(
        (acc, { amount }) => ({ ...acc, [`${amount}`]: `${amount}` }),
        {}
      ),
    [allTags]
  );

  const amounts: number[] = useMemo(() => allTags.map(({amount}) => amount), [allTags]);
  const min: number = useMemo(() => Math.min(...amounts), [amounts]);
  const max: number = useMemo(() => Math.max(...amounts), [amounts]);

  return (
    <>
      {showLimiter && (
        <div>
          Show only popular labels{" "}
          <Slider
            value={threshold}
            onChange={handleThresholdChange}
            marks={marks}
            min={min}
            max={max}
          />
        </div>
      )}
      {tagsAboveThreshold.map(tag => (
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
