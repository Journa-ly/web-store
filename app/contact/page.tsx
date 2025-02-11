const ContactPage = () => {
  return (
    <div className="mx-auto w-full max-w-md bg-base-100 p-6">
      <h1 className="mb-4 text-4xl font-bold">Contact information</h1>
      <div className="flex flex-col space-y-2 text-xl text-gray-700">
        <a href="mailto:team@journa.ai" className="link link-primary">
          team@journa.ai
        </a>
        <p>Journa, Inc.</p>
        <p>414 Fayetteville St. Suite 218 2nd Fl.</p>
        <p>Raleigh, NC 27601</p>
      </div>
    </div>
  );
};

export default ContactPage;
