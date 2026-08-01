type SchemaScriptProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function SchemaScript({ data }: SchemaScriptProps) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
