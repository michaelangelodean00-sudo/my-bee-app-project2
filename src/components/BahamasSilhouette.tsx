const BahamasSilhouette = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="100 30 640 590"
    className={className}
    aria-hidden="true"
  >
    {/* Grand Bahama — long narrow E-W island, NW corner */}
    <path d="M118,62 L130,54 L155,50 L190,47 L225,47 L255,49 L268,55 L265,64 L250,68 L215,70 L180,70 L150,68 L130,66 Z" fill="currentColor"/>

    {/* Great Abaco — curved boomerang NE of Grand Bahama */}
    <path d="M278,58 L294,52 L312,54 L324,62 L322,82 L316,105 L308,124 L296,130 L288,122 L290,100 L294,80 L286,68 Z" fill="currentColor"/>

    {/* Little Abaco tip */}
    <ellipse cx="270" cy="62" rx="7" ry="4" fill="currentColor"/>

    {/* Berry Islands — small cluster */}
    <ellipse cx="240" cy="135" rx="9" ry="5" fill="currentColor"/>
    <ellipse cx="230" cy="148" rx="5" ry="4" fill="currentColor"/>
    <ellipse cx="244" cy="152" rx="4" ry="3" fill="currentColor"/>

    {/* New Providence (Nassau) — small oval, center */}
    <ellipse cx="258" cy="210" rx="20" ry="9" fill="currentColor"/>

    {/* Andros — LARGEST island, left-center */}
    <path d="M188,182 L202,172 L214,170 L222,178 L226,200 L224,228 L220,260 L214,288 L205,318 L195,328 L184,322 L180,300 L183,268 L185,238 L187,210 Z" fill="currentColor"/>
    <path d="M195,165 L210,158 L218,163 L216,178 L202,182 L190,178 Z" fill="currentColor"/>

    {/* Eleuthera — very long thin curved island */}
    <path d="M348,168 L362,162 L370,168 L370,192 L365,228 L358,262 L352,296 L346,316 L340,312 L340,280 L344,248 L347,215 L346,185 Z" fill="currentColor"/>
    <ellipse cx="358" cy="158" rx="6" ry="4" fill="currentColor"/>

    {/* Cat Island — thin elongated */}
    <path d="M418,272 L432,265 L440,274 L437,306 L430,330 L421,334 L415,324 L416,296 L416,278 Z" fill="currentColor"/>

    {/* San Salvador */}
    <ellipse cx="500" cy="282" rx="11" ry="15" fill="currentColor"/>

    {/* Rum Cay */}
    <ellipse cx="488" cy="323" rx="9" ry="6" fill="currentColor"/>

    {/* Exuma Cays — long diagonal chain */}
    <path d="M342,332 L354,326 L362,334 L359,356 L352,376 L344,392 L336,390 L334,368 L338,348 Z" fill="currentColor"/>
    <ellipse cx="330" cy="408" rx="7" ry="10" fill="currentColor"/>
    <ellipse cx="334" cy="428" rx="5" ry="8" fill="currentColor"/>
    <ellipse cx="338" cy="448" rx="4" ry="6" fill="currentColor"/>

    {/* Long Island — long narrow */}
    <path d="M438,352 L452,344 L460,352 L457,392 L450,424 L441,438 L434,430 L436,396 L438,368 Z" fill="currentColor"/>

    {/* Crooked Island */}
    <path d="M518,402 L544,394 L556,402 L553,416 L535,422 L518,418 Z" fill="currentColor"/>

    {/* Acklins Island */}
    <path d="M536,422 L560,415 L572,426 L568,450 L556,460 L540,454 L534,438 Z" fill="currentColor"/>

    {/* Mayaguana */}
    <path d="M592,438 L618,432 L628,440 L625,452 L608,456 L594,450 Z" fill="currentColor"/>

    {/* Great Inagua — large island, far SE */}
    <path d="M572,548 L608,536 L642,538 L664,548 L668,568 L654,584 L624,592 L596,590 L572,576 L565,560 Z" fill="currentColor"/>

    {/* Little Inagua */}
    <ellipse cx="676" cy="524" rx="11" ry="7" fill="currentColor"/>
  </svg>
);

export default BahamasSilhouette;
