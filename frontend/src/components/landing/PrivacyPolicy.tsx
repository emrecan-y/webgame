import { motion } from "motion/react";
import MotionButton from "../ui/MotionButton";

type PrivacyPolicyProps = {
  setShowPrivacyPolicy: (value: boolean) => void;
};

function PrivacyPolicy({ setShowPrivacyPolicy }: PrivacyPolicyProps) {
  return (
    <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
      <motion.div
        className="fixed left-0 top-0 z-20 h-dvh w-screen cursor-pointer bg-game-main-dark bg-opacity-40 backdrop-blur-[4px]"
        onClick={() => setShowPrivacyPolicy(false)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: "linear" }}
      ></motion.div>

      <motion.div
        className="fixed z-20 w-11/12 max-w-[800px] rounded bg-game-accent-light px-4 pb-4 text-sm text-game-main-dark sm:text-base"
        initial={{
          opacity: 0,
          scale: 0,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          scale: 0,
        }}
        transition={{ type: "spring", damping: 12 }}
      >
        <div className="flex justify-between text-base sm:text-lg">
          <h1 className="py-2 font-bold">Privacy Policy & Information</h1>
          <MotionButton onClick={() => setShowPrivacyPolicy(false)}>
            ✖
          </MotionButton>
        </div>
        <div className="max-h-[36rem] overflow-scroll pb-4">
          <h2 className="mt-4 font-semibold">1. About this Project</h2>
          <p className="mt-0.5">
            This online game is a personal project created to demonstrate my
            programming expertise. It is publicly available and serves as a
            portfolio piece for showcasing my development skills.
          </p>

          <h2 className="mt-4 font-semibold">2. Use of the Chat</h2>
          <ul className="list-inside list-disc">
            <li className="mt-0.5">
              The chat is intended for respectful communication between users.
            </li>
            <li className="mt-0.5">
              There is a <span className="font-semibold">global</span> chat
              visible to <span className="font-semibold">all users</span> who
              are logged in. Users should be cautious about what they share in
              this chat as it can be seen by others.
            </li>
            <li className="mt-0.5">
              Inappropriate content such as insults, spam, or illegal material
              is prohibited.
            </li>
            <li className="mt-0.5">
              A simple profanity filter is applied to both English and German
              languages to help maintain a respectful environment.
            </li>
            <li className="mt-0.5">
              Users are responsible for their own communication.
            </li>
          </ul>

          <h2 className="mt-4 font-semibold">3. Privacy Policy</h2>
          <ul className="list-inside list-disc">
            <li className="mt-0.5">
              Usage is anonymous; there is no registration or storage of user
              profiles. No personal data is actively stored or analyzed.
            </li>
            <li className="mt-0.5">
              Chat Messages are processed temporarily for chat functionality and
              deleted automatically after 15 minutes.
            </li>
            <li className="mt-0.5">
              If a user leaves the application/ game or disconnects, any
              associated session data (other than chat messages) is immediately
              deleted.
            </li>

            <li className="mt-0.5">
              The backend is hosted on Amazon Web Services (AWS). AWS may
              generate server logs for technical reasons (e.g., IP addresses in
              access logs). These logs are not analyzed or stored by me.
            </li>

            <li className="mt-0.5">
              Once the application or server is terminated, all session data,
              including messages, is deleted from the server.
            </li>
          </ul>

          <h2 className="mt-4 font-semibold">4. Disclaimer</h2>
          <ul className="list-inside list-disc">
            <li className="mt-0.5">
              This project is still under active development, and some features
              may change or not work as expected. It is provided "as is" with no
              guarantee of availability or error-free operation.
            </li>
            <li className="mt-0.5">
              I am not responsible for any content posted by users in the chat.
            </li>
          </ul>

          <h2 className="mt-4 font-semibold">5. Contact</h2>
          <p className="mt-0.5">
            If you have any questions or issues, you can reach me at{" "}
            <a
              href="mailto:bir@emrecanyilmaz.com"
              className="underline hover:text-game-main-light"
            >
              bir@emrecanyilmaz.com
            </a>
            .
          </p>
        </div>
      </motion.div>
    </div>
  );
}
export default PrivacyPolicy;
