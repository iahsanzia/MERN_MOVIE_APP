const validateEmaiil = (email: string): boolean => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  return emailRegex.test(email);
};

console.log(`Email: ${validateEmaiil("mynameisahsan@gmail.com")}`);
