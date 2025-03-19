use std::io;

#[derive(Debug)]
pub enum Error {
    Io(io::Error),
    Custom(String),
}

impl From<io::Error> for Error {
    fn from(error: io::Error) -> Self {
        Error::Io(error)
    }
}

impl From<String> for Error {
    fn from(error: String) -> Self {
        Error::Custom(error)
    }
}
