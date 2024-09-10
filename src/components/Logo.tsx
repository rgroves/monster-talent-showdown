export default function Logo() {
  const blackAlphaLogoPath = "./logo-black-alpha-250.webp";

  return (
    <img
      fetchPriority="high"
      src={blackAlphaLogoPath}
      height="125"
      width="125"
      className="max-w-[125]"
      alt='A logo image that reads "Monster Talent Showdown" and shows a dancing werewolf to the right of the text'
    />
  );
}
