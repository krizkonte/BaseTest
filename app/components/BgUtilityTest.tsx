// Componente para testar as classes utilitárias de background (apenas neutros e brand)
function BgName({ name }: { name: string }) {
  return (
    <>
      <p
        className="inline-block surface-inverted font-mono font-medium text-on-inverted px-1 rounded shrink border-1"
        style={{ fontSize: "12px" }}
      >
        {name}
      </p>
    </>
  );
}

function SurfaceTextVariants() {
  return (
    <div className="flex flex-col gap-1 py-2">
      <p className="text-on-surface-strong ">text-on-surface-strong</p>
      <p className="text-on-surface-medium ">text-on-surface-medium</p>
      <p className="text-on-surface-weak ">text-on-surface-weak</p>
      <p className="text-on-surface-disabled ">text-on-surface-disabled</p>
      <p className="text-on-surface-danger ">text-on-surface-danger</p>
      <p className="text-on-surface-warning ">text-on-surface-warning</p>
      <p className="text-on-surface-success ">text-on-surface-success</p>
      <p className="text-on-surface-info ">text-on-surface-info</p>
    </div>
  );
}

function InvertedTextVariants() {
  return (
    <div className="flex flex-col gap-1 py-2">
      <p className="text-on-inverted ">text-on-inverted</p>
      <p className="text-on-inverted-weak ">text-on-inverted-weak</p>
      <p className="text-on-inverted-disabled ">text-on-inverted-disabled</p>
      <p className="text-on-inverted-danger ">text-on-inverted-danger</p>
      <p className="text-on-inverted-warning ">text-on-inverted-warning</p>
      <p className="text-on-inverted-success ">text-on-inverted-success</p>
      <p className="text-on-inverted-info ">text-on-inverted-info</p>
    </div>
  );
}

function AccentTextVariants() {
  return (
    <div className="flex flex-col gap-1 py-2">
      <p className="text-on-accent ">text-on-accent</p>
    </div>
  );
}

function SubtleTextVariants() {
  return (
    <div className="flex flex-col gap-1 py-2">
      <p className="text-on-subtle ">text-on-subtle</p>
    </div>
  );
}

function SubtleTextDangerVariants() {
  return (
    <div className="flex flex-col gap-1 py-2">
      <p className="text-on-subtle-danger ">text-on-subtle-danger</p>
    </div>
  );
}

function SubtleTextWarningVariants() {
  return (
    <div className="flex flex-col gap-1 py-2">
      <p className="text-on-subtle-warning ">text-on-subtle-warning</p>
    </div>
  );
}

function SubtleTextSuccessVariants() {
  return (
    <div className="flex flex-col gap-1 py-2">
      <p className="text-on-subtle-success ">text-on-subtle-success</p>
    </div>
  );
}

function SubtleTextInfoVariants() {
  return (
    <div className="flex flex-col gap-1 py-2">
      <p className="text-on-subtle-info ">text-on-subtle-info</p>
    </div>
  );
}

function DisabledSurface() {
  return (
    <div className="surface-disabled p-2 rounded">
      <p className="text-on-disabled ">text-on-disabled</p>
    </div>
  );
}

function AccentTextDangerVariants() {
  return (
    <div className="flex flex-col gap-1 py-2">
      <p className="text-on-accent-danger ">text-on-accent-danger</p>
    </div>
  );
}

function AccentTextWarningVariants() {
  return (
    <div className="flex flex-col gap-1 py-2">
      <p className="text-on-accent-warning ">text-on-accent-warning</p>
    </div>
  );
}

function AccentTextSuccessVariants() {
  return (
    <div className="flex flex-col gap-1 py-2">
      <p className="text-on-accent-success ">text-on-accent-success</p>
    </div>
  );
}

function AccentTextInfoVariants() {
  return (
    <div className="flex flex-col gap-1 py-2">
      <p className="text-on-accent-info ">text-on-accent-info</p>
    </div>
  );
}
export default function BgUtilityTest() {
  return (
    <div className="mt-8 flex flex-col gap-4 [&>*]:rounded [&>*]:p-4 [&>*]:border-1 ">
      {/* Canvas */}
      <div>
        <h2 className="mb-2  text-lg">Canvas</h2>
        <div className="flex flex-row gap-4 [&>*]:min-w-[280px] [&>*]:p-2">
          <div className="bg-canvas text-on-surface-strong">
            <BgName name="bg-canvas" />
            <SurfaceTextVariants />
            <DisabledSurface />
          </div>
        </div>
      </div>

      {/* Surface */}
      <div>
        <h2 className="mb-2  text-lg">Surface</h2>
        <div className="flex flex-row gap-4 [&>*]:min-w-[280px] [&>*]:p-2">
          <div className="surface-high">
            <BgName name="surface-high" />
            <SurfaceTextVariants />
            <DisabledSurface />
          </div>
          <div className="surface text-on-surface">
            <BgName name="surface" />
            <SurfaceTextVariants />
            <DisabledSurface />
          </div>
          <div className="surface-low text-on-surface-weak">
            <BgName name="surface-low" />
            <SurfaceTextVariants />
            <DisabledSurface />
          </div>
        </div>
      </div>

      {/* Accent */}
      <div>
        <h2 className="mb-2  text-lg">Accent</h2>
        <div className="flex flex-row gap-4 [&>*]:min-w-[280px] [&>*]:p-2">
          <div className="surface-accent">
            <BgName name="surface-accent" />
            <AccentTextVariants />
          </div>
          <div className="surface-accent-danger">
            <BgName name="surface-accent-danger" />
            <AccentTextDangerVariants />
          </div>
          <div className="surface-accent-warning">
            <BgName name="surface-accent-warning" />
            <AccentTextWarningVariants />
          </div>
          <div className="surface-accent-success">
            <BgName name="surface-accent-success" />
            <AccentTextSuccessVariants />
          </div>
          <div className="surface-accent-info">
            <BgName name="surface-accent-info" />
            <AccentTextInfoVariants />
          </div>
        </div>
      </div>

      {/* Subtle */}
      <div>
        <h2 className="mb-2  text-lg">Subtle</h2>
        <div className="flex flex-row gap-4 [&>*]:min-w-[280px] [&>*]:p-2">
          <div className="surface-subtle">
            <BgName name="surface-subtle" />
            <SubtleTextVariants />
          </div>
          <div className="surface-subtle-danger">
            <BgName name="surface-subtle-danger" />
            <SubtleTextDangerVariants />
          </div>
          <div className="surface-subtle-warning">
            <BgName name="surface-subtle-warning" />
            <SubtleTextWarningVariants />
          </div>
          <div className="surface-subtle-success">
            <BgName name="surface-subtle-success" />
            <SubtleTextSuccessVariants />
          </div>
          <div className="surface-subtle-info">
            <BgName name="surface-subtle-info" />
            <SubtleTextInfoVariants />
          </div>
        </div>
      </div>

      {/* Interactive */}
      <div>
        <h2 className="mb-2  text-lg">Interactive</h2>
        <div className="flex flex-row gap-4 [&>*]:min-w-[280px] [&>*]:p-2 mb-4">
          <div className="int-layer-accent">
            <BgName name="int-layer-accent" />
            <div>Interactive layer text</div>
          </div>
          <div className="int-layer-accent-danger">
            <BgName name="int-layer-accent-danger" />
            <div>Interactive layer text</div>
          </div>
          <div className="int-layer-accent-warning">
            <BgName name="int-layer-accent-warning" />
            <div>Interactive layer text</div>
          </div>
          <div className="int-layer-accent-success">
            <BgName name="int-layer-accent-success" />
            <div>Interactive layer text</div>
          </div>
          <div className="int-layer-accent-info">
            <BgName name="int-layer-accent-info" />
            <div>Interactive layer text</div>
          </div>
        </div>
        <div className="flex flex-row gap-4 [&>*]:min-w-[280px] [&>*]:p-2">
          <div className="int-layer-ghost">
            <BgName name="int-layer-ghost" />
            <div>Interactive layer text</div>
          </div>
          <div className="int-layer-ghost-danger">
            <BgName name="int-layer-ghost-danger" />
            <div>Interactive layer text</div>
          </div>
          <div className="int-layer-ghost-warning">
            <BgName name="int-layer-ghost-warning" />
            <div>Interactive layer text</div>
          </div>
          <div className="int-layer-ghost-success">
            <BgName name="int-layer-ghost-success" />
            <div>Interactive layer text</div>
          </div>
          <div className="int-layer-ghost-info">
            <BgName name="int-layer-ghost-info" />
            <div>Interactive layer text</div>
          </div>
        </div>
      </div>

      {/* Inverted */}
      <div>
        <h2 className="mb-2  text-lg">Inverted</h2>
        <div className="flex flex-row gap-4 [&>*]:min-w-[280px] [&>*]:p-2">
          <div className="surface-inverted">
            <BgName name="surface-inverted" />
            <InvertedTextVariants />
          </div>
        </div>
      </div>

      {/* Border */}
      <div>
        <h2 className="mb-2  text-lg">Border</h2>
        <div className="flex flex-row gap-4 [&>*]:min-w-[280px] [&>*]:p-2">
          <div className="flex flex-col gap-4 [&>*]:border-1">
            <div className="border-weak">
              <p
                className="text-on-surface-strong font-medium p-1"
                style={{ fontSize: "12px" }}
              >
                Weak
              </p>
            </div>
            <div className="border-medium">
              <p
                className="text-on-surface-strong font-medium p-1"
                style={{ fontSize: "12px" }}
              >
                Medium
              </p>
            </div>
            <div className="border-strong">
              <p
                className="text-on-surface-strong font-medium p-1"
                style={{ fontSize: "12px" }}
              >
                Strong
              </p>
            </div>
            <div className="border-accent">
              <p
                className="text-on-surface-strong font-medium p-1"
                style={{ fontSize: "12px" }}
              >
                Accent
              </p>
            </div>
            <div className="border-danger">
              <p
                className="text-on-surface-strong font-medium p-1"
                style={{ fontSize: "12px" }}
              >
                Danger
              </p>
            </div>
            <div className="border-success">
              <p
                className="text-on-surface-strong font-medium p-1"
                style={{ fontSize: "12px" }}
              >
                Success
              </p>
            </div>
            <div className="border-warning">
              <p
                className="text-on-surface-strong font-medium p-1"
                style={{ fontSize: "12px" }}
              >
                Warning
              </p>
            </div>
            <div className="border-info">
              <p
                className="text-on-surface-strong font-medium p-1"
                style={{ fontSize: "12px" }}
              >
                Info
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
